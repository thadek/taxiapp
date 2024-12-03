import 'package:flutter/material.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'driver_profile_page.dart';
import 'driver_notifications_page.dart';
import 'driver_start_page.dart';
import 'package:geolocator/geolocator.dart';
import 'package:stomp_dart_client/stomp.dart';
import 'package:stomp_dart_client/stomp_config.dart';
import 'package:stomp_dart_client/stomp_frame.dart';
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class DriverHomePage extends StatefulWidget {
  @override
  _DriverHomePageState createState() => _DriverHomePageState();
}

class _DriverHomePageState extends State<DriverHomePage> {
  int _selectedIndex = 0;

  static List<Widget> _pages = <Widget>[
    DriverStartPage(), // Página de inicio
    DriverProfilePage(),
    DriverNotificationsPage(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  late StompClient stompClient;
  final storage = FlutterSecureStorage();
  String? token;

  @override
  void initState() {
    super.initState();

    // Firebase Messaging setup
    FirebaseMessaging.instance.getToken().then((token) {
      print("Firebase Messaging Token: $token");
    });

    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('Got a message whilst in the foreground!');
      print('Message data: ${message.data}');

      if (message.notification != null) {
        print('Message also contained a notification: ${message.notification}');
        _showNotificationDialog(message.notification!.title, message.notification!.body);
      }
    });

    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      print('A new onMessageOpenedApp event was published!');
      // Aquí puedes manejar la navegación cuando se abre la aplicación desde una notificación
    });

    _loadTokenAndInitStompClient();
    _startSendingLocation();
  }

  Future<void> _loadTokenAndInitStompClient() async {
    token = await storage.read(key: 'auth_token');
    if (token != null) {
      _initStompClient();
    } else {
      print('Token not found');
    }
  }

  void _initStompClient() {
    stompClient = StompClient(
      config: StompConfig.SockJS(
        url: 'http://192.168.56.1:8080/api/v1/ws', // Asegúrate de que esta URL sea correcta
        onConnect: _onConnect,
        onWebSocketError: (dynamic error) => print(error.toString()),
        stompConnectHeaders: {'token': token!},
        webSocketConnectHeaders: {'token': token!},
      ),
    );

    stompClient.activate();
  }

  void _onConnect(StompFrame frame) {
    print('Connected: $frame');
    stompClient.subscribe(
      destination: '/topic/locations',
      callback: (StompFrame frame) {
        if (frame.body != null) {
          final data = json.decode(frame.body!);
          print('Received: $data');
          // Aquí puedes actualizar tu UI con los datos recibidos
        }
      },
    );
  }

  void sendLocation(double latitude, double longitude) {
    if (stompClient.connected) {
      stompClient.send(
        destination: '/app/location',
        body: json.encode({
          'x': latitude,
          'y': longitude,
        }),
      );
    }
  }

  void _startSendingLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    // Verificar si los servicios de ubicación están habilitados
    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      print('Location services are disabled.');
      return;
    }

    // Verificar y solicitar permisos de ubicación
    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        print('Location permissions are denied');
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      print('Location permissions are permanently denied, we cannot request permissions.');
      return;
    }

    // Escuchar el stream de posiciones y enviar la ubicación
    Geolocator.getPositionStream(
      locationSettings: LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 10,
      ),
    ).listen((Position position) {
      sendLocation(position.latitude, position.longitude);
    });
  }

  void _showNotificationDialog(String? title, String? body) {
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        backgroundColor: const Color(0xFF1f2937), // Fondo del pop-up
        title: Text(
          title ?? 'Notification',
          style: TextStyle(color: Colors.white),
        ),
        content: Text(
          body ?? 'No message body',
          style: TextStyle(color: Colors.white),
        ),
        actions: <Widget>[
          TextButton(
            child: Text('OK', style: TextStyle(color: Colors.white)),
            onPressed: () {
              Navigator.of(context).pop();
            },
          ),
        ],
      );
    },
  );
}


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('TaxiApp'),
        backgroundColor: const Color(0xFF1f2937),
        titleTextStyle: TextStyle(fontFamily: 'FontLogo', fontSize: 30),
      ),
      body: Center(
        child: _pages.elementAt(_selectedIndex),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.notifications),
            label: 'Notifications',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.blue.shade900,
        unselectedItemColor: Colors.grey,
        onTap: _onItemTapped,
      ),
    );
  }
}