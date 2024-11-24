import 'package:flutter/material.dart';

class DriverVehicleInfoPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Vehicle Info')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Vehicle: Toyota Prius', style: TextStyle(fontSize: 18)),
            SizedBox(height: 10),
            Text('License Plate: ABC-1234', style: TextStyle(fontSize: 18)),
            SizedBox(height: 10),
            Text('Year: 2015', style: TextStyle(fontSize: 18)),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // Lógica para editar la información del vehículo
              },
              child: Text('Edit Vehicle Info'),
            ),
          ],
        ),
      ),
    );
  }
}