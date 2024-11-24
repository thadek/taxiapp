import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class UserTripHistoryPage extends StatefulWidget {
  @override
  _UserTripHistoryPageState createState() => _UserTripHistoryPageState();
}

class _UserTripHistoryPageState extends State<UserTripHistoryPage> {
  final storage = FlutterSecureStorage();
  List<dynamic> _trips = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchTripHistory();
  }

  Future<void> _fetchTripHistory() async {
    String? token = await storage.read(key: 'auth_token');
    if (token == null) {
      _showSnackBar('Token no encontrado', Colors.red);
      return;
    }

    final response = await http.get(
      Uri.parse('http://192.168.56.1:8080/api/v1/rides/my'),
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
      _showSnackBar('Error al obtener el historial de viajes: ${response.reasonPhrase}', Colors.red);
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Trip History'),
        backgroundColor: Colors.blue.shade900,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _trips.isEmpty
              ? Center(child: Text('No trips found'))
              : ListView.builder(
                  itemCount: _trips.length,
                  itemBuilder: (context, index) {
                    final trip = _trips[index];
                    return Card(
                      margin: EdgeInsets.all(10),
                      child: ListTile(
                        title: Text('Trip to ${trip['dropoff_location']}'),
                        subtitle: Text('Date: ${trip['created_at']}'),
                        trailing: Text(trip['price'] != null ? '\$${trip['price']}' : 'Pending'),
                      ),
                    );
                  },
                ),
    );
  }
}