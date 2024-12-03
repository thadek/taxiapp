import 'package:flutter/material.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'user_profile_page.dart';
import 'user_request_taxi_page.dart';
import 'user_trip_history_page.dart';
import 'user_current_trip_page.dart';

class UserHomePage extends StatefulWidget {
  @override
  _UserHomePageState createState() => _UserHomePageState();
}

class _UserHomePageState extends State<UserHomePage> {
  int _selectedIndex = 0;

  static List<Widget> _pages = <Widget>[
    UserRequestTaxiPage(),
    UserTripHistoryPage(),
    UserProfilePage(),
    UserCurrentTripPage(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

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
            icon: Icon(Icons.local_taxi),
            label: 'Request Taxi',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.history),
            label: 'Trip History',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.directions_car),
            label: 'Current Trip',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: const Color(0xFFFFFFFF), // Color del ítem seleccionado (blanco)
        unselectedItemColor: const Color(0xFF9CA3AF), // Color de los ítems no seleccionados (gris claro)
        backgroundColor: const Color(0xFF18181b), // Color de fondo del BottomNavigationBar
        onTap: _onItemTapped,
      ),
    );
  }
}