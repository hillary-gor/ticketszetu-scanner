// app/index.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  Image
} from 'react-native';
import { useRouter, Href } from 'expo-router';
import { supabase } from '../utils/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Authentication Failed', 'Staff ID and Authorization Code are required.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });
    setLoading(false);

    if (error) {
      Alert.alert('Access Denied', error.message);
    } else {
      router.replace('/(scan)/dashboard' as Href);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Light content for dark mode background */}
      <StatusBar barStyle="light-content" />
      
      <View style={styles.content}>
        {/* Official Brand Header */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://zqgbqiousiqoyhcedsdr.supabase.co/storage/v1/object/public/icons-logos/ticketszetu.com-logo.png' }}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.titleRow}>
            <Text style={styles.titleBase}>Tickets</Text>
            <Text style={styles.titleAccent}>Zetu</Text>
          </View>
          <Text style={styles.subtitle}>OFFICIAL SCANNER OPS</Text>
        </View>

        {/* Form Inputs */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>STAFF EMAIL</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="gate.agent@event.com"
                placeholderTextColor="#4B5563"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>AUTHORIZATION CODE</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#4B5563"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Log In Securely</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Ionicons name="shield-checkmark-outline" size={14} color="#6B7280" />
          <Text style={styles.footerText}>Enterprise Access Control</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0A121D' 
  },
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    paddingHorizontal: 32 
  },
  
  // Header Styles
  headerContainer: { 
    alignItems: 'center',
    marginBottom: 48 
  },
  logoContainer: {
    width: 80,
    height: 80,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleBase: { 
    color: '#FFFFFF', 
    fontSize: 32, 
    fontWeight: '900', 
    letterSpacing: -0.5,
  },
  titleAccent: { 
    color: '#FF9500',
    fontSize: 32, 
    fontWeight: '900', 
    letterSpacing: -0.5,
  },
  subtitle: { 
    color: '#1F3A5C',
    backgroundColor: 'rgba(31, 58, 92, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(31, 58, 92, 0.4)',
    fontSize: 12, 
    fontWeight: '800', 
    letterSpacing: 2,
    overflow: 'hidden',
  },

  // Form Styles
  form: { 
    gap: 20 
  },
  inputGroup: {
    gap: 8,
  },
  label: { 
    color: '#8A99A8', 
    fontSize: 11, 
    fontWeight: '700', 
    letterSpacing: 1,
    marginLeft: 4
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111D2B',
    borderWidth: 1,
    borderColor: '#1F3A5C',
    borderRadius: 12,
    height: 56,
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 12,
  },
  input: { 
    flex: 1,
    color: '#FFFFFF', 
    fontSize: 16, 
    height: '100%',
  },
  
  // Button Styles
  button: { 
    backgroundColor: '#FF9500',
    height: 56,
    borderRadius: 12, 
    justifyContent: 'center',
    alignItems: 'center', 
    marginTop: 12,
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: { 
    opacity: 0.6,
    shadowOpacity: 0,
  },
  buttonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '800', 
    letterSpacing: 0.5 
  },

  // Footer Styles
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 48,
    gap: 6,
  },
  footerText: {
    color: '#6B7280', 
    fontSize: 12,
    fontWeight: '500',
  }
});