import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { Camera, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function CheckinScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Validação IA</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.camContainer}>
        <View style={styles.scannerLine} />
        <View style={styles.cornerTL} />
        <View style={styles.cornerTR} />
        <View style={styles.cornerBL} />
        <View style={styles.cornerBR} />
        
        <Camera size={64} color="rgba(255,255,255,0.2)" />
        <Text style={styles.camStatus}>ESCANEANDO AMBIENTE...</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.mainBtn} onPress={() => router.back()}>
          <Text style={styles.mainBtnText}>CAPTURAR E VALIDAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secBtn}>
          <Text style={styles.secBtnText}>ESCOLHER DA GALERIA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 24 },
  title: { fontSize: 24, fontFamily: 'Syne_800', color: Colors.text },
  closeBtn: { padding: 8 },
  camContainer: { flex: 1, backgroundColor: '#000', borderRadius: 32, borderWidth: 2, borderColor: '#222', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  scannerLine: { position: 'absolute', top: '35%', width: '100%', height: 2, backgroundColor: Colors.neonLime, shadowColor: Colors.neonLime, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10, opacity: 0.6 },
  cornerTL: { position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderLeftWidth: 4, borderTopWidth: 4, borderColor: Colors.neonLime, borderTopLeftRadius: 12 },
  cornerTR: { position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRightWidth: 4, borderTopWidth: 4, borderColor: Colors.neonLime, borderTopRightRadius: 12 },
  cornerBL: { position: 'absolute', bottom: 20, left: 20, width: 40, height: 40, borderLeftWidth: 4, borderBottomWidth: 4, borderColor: Colors.neonLime, borderBottomLeftRadius: 12 },
  cornerBR: { position: 'absolute', bottom: 20, right: 20, width: 40, height: 40, borderRightWidth: 4, borderBottomWidth: 4, borderColor: Colors.neonLime, borderBottomRightRadius: 12 },
  camStatus: { color: Colors.neonLime, fontWeight: '800', letterSpacing: 2, fontSize: 12, marginTop: 24 },
  actions: { paddingVertical: 24, gap: 12 },
  mainBtn: { backgroundColor: Colors.neonLime, padding: 20, borderRadius: 24, alignItems: 'center' },
  mainBtnText: { color: Colors.background, fontWeight: '900', fontSize: 16 },
  secBtn: { backgroundColor: Colors.card, padding: 20, borderRadius: 24, alignItems: 'center' },
  secBtnText: { color: Colors.text, fontWeight: '700', fontSize: 14 },
});
