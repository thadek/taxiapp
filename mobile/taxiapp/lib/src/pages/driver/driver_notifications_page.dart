import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';
import 'package:getwidget/getwidget.dart';

class DriverNotificationsPage extends StatefulWidget {
  @override
  _DriverNotificationsPageState createState() => _DriverNotificationsPageState();
}

class _DriverNotificationsPageState extends State<DriverNotificationsPage> {
  final storage = FlutterSecureStorage();
  List<Map<String, dynamic>> _ridesData = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchAssignedRides();
  }

  Future<void> _fetchAssignedRides() async {
    String? token = await storage.read(key: 'auth_token');
    if (token == null) {
      _showSnackBar('Token no encontrado', Colors.red);
      return;
    }

    final response = await http.get(
      Uri.parse('http://192.168.56.1:8080/api/v1/rides/driver/assigned'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        _ridesData = List<Map<String, dynamic>>.from(data['content']);
        _isLoading = false;
      });
    } else {
      _showSnackBar('Error al obtener la información del viaje: ${response.reasonPhrase}', Colors.red);
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

  Future<void> _acceptRide(String rideId) async {
    String? token = await storage.read(key: 'auth_token');
    if (token == null) {
      _showSnackBar('Token no encontrado', Colors.red);
      return;
    }

    final response = await http.post(
      Uri.parse('http://192.168.56.1:8080/api/v1/rides/$rideId/accept'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      _showSnackBar('Viaje aceptado con éxito', Colors.green);
      _fetchAssignedRides(); // Actualizar la lista de viajes
    } else {
      _showSnackBar('Error al aceptar el viaje: ${response.reasonPhrase}', Colors.red);
    }
  }

  Future<void> _rejectRide(String rideId) async {
    String? token = await storage.read(key: 'auth_token');
    if (token == null) {
      _showSnackBar('Token no encontrado', Colors.red);
      return;
    }

    final response = await http.post(
      Uri.parse('http://192.168.56.1:8080/api/v1/rides/$rideId/reject'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      _showSnackBar('Viaje rechazado con éxito', Colors.green);
      _fetchAssignedRides(); // Actualizar la lista de viajes
    } else {
      _showSnackBar('Error al rechazar el viaje: ${response.reasonPhrase}', Colors.red);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Notificaciones de Viajes'),
        backgroundColor: const Color(0xFF1f2937),
        titleTextStyle: TextStyle(color: Colors.white, fontSize: 24, fontFamily: 'Roboto', fontWeight: FontWeight.bold),
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: _ridesData.length,
              itemBuilder: (context, index) {
                final ride = _ridesData[index];
                return GFListTile(
                  titleText: 'Nuevo viaje solicitado por ${ride['client']['name']}',
                  subTitleText: 'Recogida: ${ride['pickup_location']}',
                  icon: Icon(Icons.directions_car, color: Colors.blue),
                  title: Text(
                    'Nuevo viaje solicitado por ${ride['client']['name']}',
                    style: TextStyle(color: Colors.white),
                  ),
                  subTitle: Text(
                    'Recogida: ${ride['pickup_location']}',
                    style: TextStyle(color: Colors.white),
                  ),
                  color: const Color.fromARGB(255, 163, 163, 163), // Fondo del contenedor
                  onTap: () {
                    // Mostrar el pop-up con la información del viaje
                    showDialog(
                      context: context,
                      builder: (BuildContext context) {
                        return AlertDialog(
                          backgroundColor: const Color(0xFF1f2937), // Fondo del pop-up
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(10.0))),
                          title: Text('Información del viaje', style: TextStyle(color: Colors.white)),
                          content: SingleChildScrollView(
                            child: ListBody(
                              children: [
                                Text('Cliente: ${ride['client']['name']}', style: TextStyle(color: Colors.white)),
                                SizedBox(height: 10),
                                Text('Recogida: ${ride['pickup_location']}', style: TextStyle(color: Colors.white)),
                                SizedBox(height: 10),
                                Text('Destino: ${ride['dropoff_location']}', style: TextStyle(color: Colors.white)),
                                SizedBox(height: 10),                                
                                Text('Comentarios: ${ride['comments'] ?? 'Ninguno'}', style: TextStyle(color: Colors.white)),
                              ],
                            ),
                          ),
                          actions: <Widget>[
                            TextButton(
                              onPressed: () {
                                _acceptRide(ride['id']);
                                Navigator.of(context).pop();
                              },
                              child: Text('Aceptar viaje', style: TextStyle(color: Colors.white)),
                            ),
                            TextButton(
                              onPressed: () {
                                _rejectRide(ride['id']);
                                Navigator.of(context).pop();
                              },
                              child: Text('Cancelar viaje', style: TextStyle(color: Colors.red)),
                            ),
                          ],
                        );
                      },
                    );
                  },
                );
              },
            ),
    );
  }
}
