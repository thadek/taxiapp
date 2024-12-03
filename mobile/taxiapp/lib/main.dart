import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'src/pages/login_page.dart';
import 'src/pages/register_page.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  // ignore: unused_local_variable
  FirebaseAnalytics analytics = FirebaseAnalytics.instance;
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  runApp(MyApp());
}

Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  print('Handling a background message: ${message.messageId}');
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => MyAppState(),
      child: MaterialApp(
        debugShowCheckedModeBanner: false, // Eliminar el banner de depuración
        title: 'TaxiApp',
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color.fromARGB(255, 252, 252, 253),
            surface: const Color(0xFF0f172a), // Fondo
          ),
          scaffoldBackgroundColor: const Color(0xFF0f172a), // Fondo de la aplicación
          bottomNavigationBarTheme: BottomNavigationBarThemeData(
            backgroundColor: const Color(0xFF1f2937), // Fondo de la barra de navegación
            selectedItemColor: const Color(0xFFFFFFFF), // Color del ítem seleccionado
            unselectedItemColor: const Color(0xFF9CA3AF), // Color de los ítems no seleccionados
          ),
        ),
        home: MyHomePage(),
      ),
    );
  }
}

class MyAppState extends ChangeNotifier {
  
  final storage = FlutterSecureStorage();
  String? token;

  MyAppState() {
    _loadToken();
  }

  Future<void> _loadToken() async {
    token = await storage.read(key: 'jwt_token');
    if (token == null) {
      print('Token not found');
    }
  }

  void startSendingLocation() async {
    // Eliminar la lógica de envío de ubicación
  }

  Future<void> sendLocation(double latitude, double longitude) async {
    if (token == null) {
      print('Token not found');
      return;
    }
    // Eliminar la lógica de envío de ubicación
  }
}

class MyHomePage extends StatefulWidget {
  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  var selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    context.read<MyAppState>().startSendingLocation();

    // Firebase Messaging setup
    FirebaseMessaging.instance.getToken().then((token) {
      print("Firebase Messaging Token: $token");
    });

    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('Got a message whilst in the foreground!');
      print('Message data: ${message.data}');

      if (message.notification != null) {
        print('Message also contained a notification: ${message.notification}');
      }
    });

    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      print('A new onMessageOpenedApp event was published!');
      // Aquí puedes manejar la navegación cuando se abre la aplicación desde una notificación
    });
  }

  @override
  Widget build(BuildContext context) {
    Widget page;
    switch (selectedIndex) {
      case 0:
        page = GeneratorPage();
        break;
      case 1:
        page = LoginPage();
        break;
      case 2:
        page = RegisterPage(); // Agregamos la página de registro
        break;
      default:
        throw UnimplementedError('No widget for $selectedIndex');
    }
    return Scaffold(
      body: SafeArea(
        child: page, // Página seleccionada.
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: selectedIndex,
        onTap: (index) {
          setState(() {
            selectedIndex = index;
          });
        },
        selectedItemColor: const Color(0xFFFFFFFF), // Color del ítem seleccionado (blanco)
        unselectedItemColor: const Color(0xFF9CA3AF), // Color de los ítems no seleccionados (gris claro)
        backgroundColor: const Color(0xFF18181b), // Color de fondo del BottomNavigationBar/ Color de fondo del BottomNavigationBar
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.login),
            label: 'Login',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.app_registration),
            label: 'Register', // Nuevo ícono para el registro
          ),
        ],
      ),
    );
  }
}

class GeneratorPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            'TaxiApp',
            style: TextStyle(
              fontFamily: 'FontLogo',
              fontSize: 40,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),  
          SizedBox(height: 20),
          Text(
            'Tu solución para encontrar un taxi rápido y seguro.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              color: Colors.white,
            ),
          ),
          SizedBox(height: 20),
          Text(
            'Inicia sesion o crea tu cuenta para comenzar.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              color: Colors.white,
            ),
          ),
          SizedBox(height: 20),
          Image.asset(
            'assets/images/taxi.png', // Asegúrate de que la ruta sea correcta
            height: 100,
            width: 100,
          ),
        ],
      ),
    );
  }
}

class HomePage extends StatefulWidget {
  @override
  HomePageState createState() => HomePageState();
}

class HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

  static List<Widget> _pages = <Widget>[
    Center(child: Text('Home Page', style: TextStyle(fontSize: 24))),
    Center(child: Text('Favorites Page', style: TextStyle(fontSize: 24))),
    Center(child: Text('Profile Page', style: TextStyle(fontSize: 24))),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Welcome')),
      body: Center(
        child: _pages.elementAt(_selectedIndex), // Cambia la página según el índice
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.favorite),
            label: 'Favorites',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.blue,
        onTap: _onItemTapped,
      ),
    );
  }
}