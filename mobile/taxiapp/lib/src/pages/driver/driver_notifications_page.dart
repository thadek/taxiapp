import 'package:flutter/material.dart';

class DriverNotificationsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Notifications')),
      body: ListView(
        children: [
          ListTile(
            title: Text('New ride request from Alice'),
            subtitle: Text('Pickup: 123 Main St'),
            trailing: ElevatedButton(
              onPressed: () {
                // Lógica para aceptar la solicitud de viaje
              },
              child: Text('Accept'),
            ),
          ),
          ListTile(
            title: Text('New ride request from Bob'),
            subtitle: Text('Pickup: 456 Elm St'),
            trailing: ElevatedButton(
              onPressed: () {
                // Lógica para aceptar la solicitud de viaje
              },
              child: Text('Accept'),
            ),
          ),
          // Más notificaciones...
        ],
      ),
    );
  }
}