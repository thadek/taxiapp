import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:taxiapp/main.dart'; // Asegúrate de importar la página principal de la aplicación

class DriverProfilePage extends StatefulWidget {
  @override
  _DriverProfilePageState createState() => _DriverProfilePageState();
}

class _DriverProfilePageState extends State<DriverProfilePage> {
  final storage = FlutterSecureStorage();
  Map<String, dynamic>? _driverData;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchDriverProfile();
  }

  Future<void> _fetchDriverProfile() async {
    String? token = await storage.read(key: 'auth_token');
    if (token == null) {
      _showSnackBar('Token no encontrado', Colors.red);
      return;
    }

    final response = await http.get(
      Uri.parse('http://192.168.56.1:8080/api/v1/auth/me'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        _driverData = data;
        _isLoading = false;
      });
    } else {
      _showSnackBar('Error al obtener el perfil: ${response.reasonPhrase}', Colors.red);
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _showSnackBar(String message, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: color,
      ),
    );
  }

  Future<void> _logout() async {
    await storage.delete(key: 'auth_token');
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (context) => MyApp()), // Redirige a la página principal
      (Route<dynamic> route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Driver Profile'),
        backgroundColor: Colors.blue.shade900,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _driverData == null
              ? Center(child: Text('No driver data found'))
              : Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Card(
                        elevation: 4,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Icon(Icons.person, size: 50, color: Colors.blue.shade900),
                                  SizedBox(width: 10),
                                  Text(
                                    'Hola, ${_driverData!['name']}!',
                                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                                  ),
                                ],
                              ),
                              SizedBox(height: 20),
                              ListTile(
                                leading: Icon(Icons.account_circle, color: Colors.blue.shade900),
                                title: Text('Username'),
                                subtitle: Text('${_driverData!['username']}'),
                              ),
                              ListTile(
                                leading: Icon(Icons.email, color: Colors.blue.shade900),
                                title: Text('Email'),
                                subtitle: Text('${_driverData!['email']}'),
                              ),
                              ListTile(
                                leading: Icon(Icons.phone, color: Colors.blue.shade900),
                                title: Text('Phone'),
                                subtitle: Text('${_driverData!['phone']}'),
                              ),
                            ],
                          ),
                        ),
                      ),
                      SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: _logout,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red,
                        ),
                        child: Text('Logout'),
                      ),
                    ],
                  ),
                ),
    );
  }
}