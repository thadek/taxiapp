import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:taxiapp/main.dart'; // Asegúrate de importar la página principal de la aplicación
import 'package:stomp_dart_client/stomp.dart';

class DriverProfilePage extends StatefulWidget {
  @override
  _DriverProfilePageState createState() => _DriverProfilePageState();
}

class _DriverProfilePageState extends State<DriverProfilePage> {
  final storage = FlutterSecureStorage();
  Map<String, dynamic>? _driverData;
  Map<String, dynamic>? _vehicleData;
  bool _isLoading = true;
  StompClient? stompClient;

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
      });
      await _fetchVehicleInfo(token, data['id']);
    } else {
      _showSnackBar('Error al obtener el perfil: ${response.reasonPhrase}', Colors.red);
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _fetchVehicleInfo(String token, String userId) async {
    final response = await http.get(
      Uri.parse('http://192.168.56.1:8080/api/v1/vehicles/find-by-driver-email/driver@gmail.com'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        _vehicleData = data;
        _isLoading = false;
      });
    } else {
      _showSnackBar('Error al obtener la información del vehículo: ${response.reasonPhrase}', Colors.red);
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _showSnackBar(String message, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message, style: TextStyle(color: Colors.white)),
        backgroundColor: color,
      ),
    );
  }

  Future<void> _logout() async {
    String? email = await storage.read(key: 'user_email');

    if (email != null) {
      // Eliminar el token FCM utilizando el email
      final response = await http.delete(
        Uri.parse('http://192.168.56.1:8080/api/v1/fcm/delete-fcm-token?email=$email'),
        headers: {
          'Authorization': 'Bearer ${await storage.read(key: 'auth_token')}',
        },
      );

      if (response.statusCode == 200) {
        print('FCM token deleted successfully');
      } else {
        print('Failed to delete FCM token: ${response.reasonPhrase}');
      }
    }

    // Eliminar el token de autenticación del secure storage
    await storage.delete(key: 'auth_token');

    // Redirigir a la página principal
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
        title: Text('Perfil'),
        backgroundColor: const Color(0xFF1f2937),
        titleTextStyle: TextStyle(color: Colors.white, fontSize: 24, fontFamily: 'Roboto', fontWeight: FontWeight.bold),
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _driverData == null
              ? Center(child: Text('No se encontró información del conductor', style: TextStyle(color: Colors.white)))
              : Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Card(
                          elevation: 4,
                          color: Color(0xFF030712),
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
                                      style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
                                    ),
                                  ],
                                ),
                                SizedBox(height: 20),
                                ListTile(
                                  leading: Icon(Icons.account_circle, color: Colors.blue.shade900),
                                  title: Text('Nombre de usuario', style: TextStyle(color: Colors.white)),
                                  subtitle: Text('${_driverData!['username']}', style: TextStyle(color: Colors.white)),
                                ),
                                ListTile(
                                  leading: Icon(Icons.email, color: Colors.blue.shade900),
                                  title: Text('Correo electrónico', style: TextStyle(color: Colors.white)),
                                  subtitle: Text('${_driverData!['email']}', style: TextStyle(color: Colors.white)),
                                ),
                                ListTile(
                                  leading: Icon(Icons.phone, color: Colors.blue.shade900),
                                  title: Text('Teléfono', style: TextStyle(color: Colors.white)),
                                  subtitle: Text('${_driverData!['phone']}', style: TextStyle(color: Colors.white)),
                                ),
                              ],
                            ),
                          ),
                        ),
                        SizedBox(height: 20),
                        _vehicleData == null
                            ? Center(child: Text('No se encontró información del vehículo', style: TextStyle(color: Colors.white)))
                            : Card(
                                elevation: 4,
                                color: Color(0xFF030712),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Información del vehículo',
                                        style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
                                      ),
                                      SizedBox(height: 16),
                                      ListTile(
                                        leading: Icon(Icons.directions_car, color: Colors.blue.shade900),
                                        title: Text('Marca', style: TextStyle(color: Colors.white)),
                                        subtitle: Text('${_vehicleData!['brand']}', style: TextStyle(color: Colors.white)),
                                      ),
                                      ListTile(
                                        leading: Icon(Icons.directions_car, color: Colors.blue.shade900),
                                        title: Text('Modelo', style: TextStyle(color: Colors.white)),
                                        subtitle: Text('${_vehicleData!['model']}', style: TextStyle(color: Colors.white)),
                                      ),
                                      ListTile(
                                        leading: Icon(Icons.directions_car, color: Colors.blue.shade900),
                                        title: Text('Placa', style: TextStyle(color: Colors.white)),
                                        subtitle: Text('${_vehicleData!['licensePlate']}', style: TextStyle(color: Colors.white)),
                                      ),
                                      ListTile(
                                        leading: Icon(Icons.color_lens, color: Colors.blue.shade900),
                                        title: Text('Color', style: TextStyle(color: Colors.white)),
                                        subtitle: Text('${_vehicleData!['color']}', style: TextStyle(color: Colors.white)),
                                      ),
                                      ListTile(
                                        leading: Icon(Icons.event, color: Colors.blue.shade900),
                                        title: Text('Año', style: TextStyle(color: Colors.white)),
                                        subtitle: Text('${_vehicleData!['year']}', style: TextStyle(color: Colors.white)),
                                      ),
                                      ListTile(
                                        leading: Icon(Icons.info, color: Colors.blue.shade900),
                                        title: Text('Detalles', style: TextStyle(color: Colors.white)),
                                        subtitle: Text('${_vehicleData!['details']}', style: TextStyle(color: Colors.white)),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                        SizedBox(height: 20),
                        ElevatedButton.icon(
                          onPressed: _logout,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red,
                            padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(30),
                            ),
                          ),
                          icon: Icon(Icons.logout, color: Colors.white),
                          label: Text('Cerrar sesión', style: TextStyle(color: Colors.white, fontSize: 16)),
                        ),
                      ],
                    ),
                  ),
                ),
    );
  }
}
