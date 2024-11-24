import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class UserCurrentTripPage extends StatefulWidget {
  @override
  _UserCurrentTripPageState createState() => _UserCurrentTripPageState();
}

class _UserCurrentTripPageState extends State<UserCurrentTripPage> {
  final storage = FlutterSecureStorage();
  List<dynamic> _trips = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchCurrentTrips();
  }

  Future<void> _fetchCurrentTrips() async {
    String? token = await storage.read(key: 'auth_token');
    if (token == null) {
      _showSnackBar('Token no encontrado', Colors.red);
      return;
    }

    final response = await http.get(
      Uri.parse('http://192.168.56.1:8080/api/v1/rides/my/active'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        _trips = data['content'];
        _isLoading = false;
      });
    } else {
      _showSnackBar('Error al obtener los viajes activos: ${response.reasonPhrase}', Colors.red);
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _cancelTrip(String tripId) async {
    String? token = await storage.read(key: 'auth_token');
    if (token == null) {
      _showSnackBar('Token no encontrado', Colors.red);
      return;
    }

    final response = await http.post(
      Uri.parse('http://192.168.56.1:8080/api/v1/rides/$tripId/client-cancel'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      _showSnackBar('Viaje cancelado exitosamente', Colors.green);
      _fetchCurrentTrips(); // Refrescar la lista de viajes
    } else {
      _showSnackBar('Error al cancelar el viaje: ${response.reasonPhrase}', Colors.red);
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Current Trips'),
        backgroundColor: Colors.blue.shade900,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _trips.isEmpty
              ? Center(child: Text('No active trips found'))
              : ListView.builder(
                  itemCount: _trips.length,
                  itemBuilder: (context, index) {
                    final trip = _trips[index];
                    return Card(
                      margin: EdgeInsets.all(10),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Driver: ${trip['driver'] != null ? trip['driver']['name'] : 'N/A'}',
                              style: TextStyle(fontSize: 18),
                            ),
                            SizedBox(height: 10),
                            Text(
                              'Vehicle: ${trip['vehicle'] != null ? trip['vehicle']['model'] : 'N/A'}',
                              style: TextStyle(fontSize: 18),
                            ),
                            SizedBox(height: 10),
                            Text(
                              'License Plate: ${trip['vehicle'] != null ? trip['vehicle']['license_plate'] : 'N/A'}',
                              style: TextStyle(fontSize: 18),
                            ),
                            SizedBox(height: 10),
                            Text(
                              'Estimated Fare: ${trip['price'] != null ? '\$${trip['price']}' : 'Pending'}',
                              style: TextStyle(fontSize: 18),
                            ),
                            SizedBox(height: 10),
                            Text(
                              'Status: ${trip['status']}',
                              style: TextStyle(fontSize: 18),
                            ),
                            SizedBox(height: 20),
                            ElevatedButton(
                              onPressed: () => _cancelTrip(trip['id']),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.red,
                              ),
                              child: Text('Cancel Trip'),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}