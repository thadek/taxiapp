// src/pages/register_page.dart
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class RegisterPage extends StatefulWidget {
  @override
  RegisterPageState createState() => RegisterPageState();
}

class RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _emailController = TextEditingController();
  final _nameController = TextEditingController();
  final _lastnameController = TextEditingController();

  String _token = '';

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) return;

    final response = await http.post(
      Uri.parse('http://192.168.56.1:8080/auth/register'), // Reemplaza con tu URL
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode({
        'username': _usernameController.text.trim(),
        'password': _passwordController.text.trim(),
        'email': _emailController.text.trim(),
        'name': _nameController.text.trim(),
        'lastname': _lastnameController.text.trim(),
      }),
    );

    if (response.statusCode == 200) {
      final responseData = jsonDecode(response.body);
      setState(() {
        _token = responseData['token'];
      });
      _showSnackBar('Registro exitoso. Token: $_token', Colors.green);
    } else {
      _showSnackBar('Error en el registro: ${response.reasonPhrase}', Colors.red);
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
      appBar: AppBar(title: Text('Registro')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              _buildTextField(_usernameController, 'Username', false),
              _buildTextField(_passwordController, 'Password', true),
              _buildTextField(_emailController, 'Email', false, isEmail: true),
              _buildTextField(_nameController, 'Nombre', false),
              _buildTextField(_lastnameController, 'Apellido', false),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: _register,
                child: Text('Registrar'),
              ),
              if (_token.isNotEmpty) ...[
                SizedBox(height: 20),
                Text('Token: $_token', style: TextStyle(color: Colors.green)),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String label, bool isObscure, {bool isEmail = false}) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(labelText: label),
      obscureText: isObscure,
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'Por favor ingrese $label';
        }
        if (isEmail && !value.contains('@')) {
          return 'Por favor ingrese un email válido';
        }
        return null;
      },
    );
  }
}




