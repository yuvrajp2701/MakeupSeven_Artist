import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../utils/Colors';
import { apiCall } from '../../services/api';
import { getToken } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';

const TRANSACTIONS = [
  {
    id: '1',
    title: 'Wedding Makeup',
    name: 'Sarah Johnson',
    date: '2024-12-10 • 10:00 AM',
    amount: '+₹1299',
    status: 'Completed',
    type: 'incoming'
  },
  {
    id: '2',
    title: 'Bridal Hair Styling',
    name: 'Emily Davis',
    date: '2024-12-12 • 2:00 PM',
    amount: '+₹799',
    status: 'Processing',
    type: 'incoming'
  },
  {
    id: '3',
    title: 'Photoshoot Makeup',
    name: 'Jessica Miller',
    date: '2024-12-08 • 11:00 AM',
    amount: '+₹899',
    status: 'Completed',
    type: 'incoming'
  },
  {
    id: '5',
    title: 'Commission Deduction',
    name: 'Cash Payment - Hair Cut',
    date: '2024-12-07 • 4:00 PM',
    amount: '-₹200',
    status: 'Completed',
    type: 'outgoing'
  },
  {
    id: '4',
    title: 'Course Purchase',
    name: 'Editorial & Fashion Makeup',
    date: '2024-12-05 • 3:30 PM',
    amount: '-₹129',
    status: 'Completed',
    type: 'outgoing'
  },
];

const ArtistWalletScreen = () => {
  const { userToken } = useAuth();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [statementModalVisible, setStatementModalVisible] = React.useState(false);
  const [pdfVisible, setPdfVisible] = React.useState(false); // Added for PDF preview
  const [successModalVisible, setSuccessModalVisible] = React.useState(false);
  const [withdrawAmount, setWithdrawAmount] = React.useState('');

  const [loading, setLoading] = React.useState(true);
  const [wallet, setWallet] = React.useState<any>(null);
  const [transactions, setTransactions] = React.useState<any[]>([]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const token = userToken || await getToken();
      if (!token) return;

      // 1. Fetch Wallet
      try {
        const walletData = await apiCall('/reward/user/wallet', { method: 'GET', token, silent: true });
        if (walletData && typeof walletData === 'object') {
          setWallet(walletData);
        }
      } catch (e) {
        console.log('Wallet balance fetch failed:', e);
      }

      // 2. Fetch Ledger (Transactions)
      try {
        const ledgerData = await apiCall('/reward/user/wallet/ledger', { method: 'GET', token, silent: true });
        const list = Array.isArray(ledgerData) ? ledgerData : (ledgerData?.ledger || ledgerData?.data || []);

        const mapped = list.map((item: any) => ({
          id: item.id || item._id,
          title: item.title || (item.type === 'credit' ? 'Earnings' : 'Withdrawal'),
          name: item.description || '',
          date: new Date(item.createdAt).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric' }),
          amount: (item.type === 'credit' ? '+₹' : '-₹') + (item.points || item.amount || 0),
          status: item.status || 'Completed',
          type: item.type === 'credit' ? 'incoming' : 'outgoing'
        }));
        setTransactions(mapped);
      } catch (e) {
        console.log('Wallet ledger fetch failed:', e);
      }
    } catch (e) {
      console.warn('Wallet fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchWalletData();
  }, [userToken]);

  const [isWithdrawing, setIsWithdrawing] = React.useState(false);

  const [bankDetails, setBankDetails] = React.useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: ''
  });

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 500) {
      Alert.alert('Invalid Amount', 'Minimum withdrawal amount is ₹500.');
      return;
    }

    if (!bankDetails.accountHolderName || !bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.bankName) {
      Alert.alert('Missing Info', 'Please fill all bank details to continue.');
      return;
    }

    try {
      setIsWithdrawing(true);
      const token = userToken || await getToken();
      if (!token) {
        Alert.alert('Error', 'Authentication required. Please login again.');
        return;
      }

      const response = await apiCall('/reward/user/wallet/redeem', {
        method: 'POST',
        token,
        body: {
          pointsToRedeem: amount,
          bankDetails
        }
      });

      console.log('Withdrawal response:', response);
      setSuccessModalVisible(true);
      fetchWalletData(); // Refresh wallet data
    } catch (error: any) {
      console.error('Withdrawal failed:', error);
      Alert.alert('Withdrawal Failed', error.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const closeAllModals = () => {
    setSuccessModalVisible(false);
    setModalVisible(false);
    setWithdrawAmount('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Wallet</Text>
          <Text style={styles.headerSubtitle}>Track your earnings</Text>
        </View>

        {/* Balance Card */}
        <LinearGradient
          colors={['#8855FF', '#A070FF']} // Purple gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardTopRow}>
            <View>
              <Text style={styles.cardLabel}>Available Balance</Text>
              <View style={styles.amountContainer}>
                <Text style={styles.amountSymbol}>₹</Text>
                <Text style={styles.amountText}>{wallet?.totalPoints || wallet?.balance || '0'}</Text>
                <Text style={styles.amountDecimal}>.00</Text>
              </View>
            </View>
            <View style={styles.iconCircle}>
              <Icon name="credit-card" size={24} color="#fff" />
            </View>
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.withdrawButton} onPress={() => setModalVisible(true)}>
              <Icon name="file-download" size={20} color="#8855FF" style={{ marginRight: 6 }} />
              <Text style={styles.withdrawText}>Withdraw</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statementButton} onPress={() => setStatementModalVisible(true)}>
              <Text style={styles.statementText}>Statement</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Earned</Text>
            <Text style={styles.statValue}>₹{wallet?.totalEarnedPoints || wallet?.totalPoints || '0'}</Text>
            <Text style={styles.statGrowth}>↗ Recently synced</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>This Month</Text>
            <Text style={styles.statValue}>₹{wallet?.pointsThisMonth || '0'}</Text>
            <Text style={styles.statGrowth}>↗ Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Pending</Text>
            <Text style={styles.statValue}>₹{wallet?.pendingPoints || '0'}</Text>
            <Text style={styles.statNote}>0 payments</Text>
          </View>
        </View>

        {/* Transaction History */}
        <Text style={styles.sectionTitle}>Transaction History</Text>

        <View style={styles.transactionsList}>
          {transactions.length > 0 ? (
            transactions.map((item) => (
              <View key={item.id} style={styles.transactionCard}>
                <View style={[
                  styles.transactionIconContainer,
                  { backgroundColor: item.type === 'incoming' ? '#E8F5E9' : '#FFEBEE' }
                ]}>
                  <Icon
                    name={item.type === 'incoming' ? 'south-west' : 'north-east'}
                    size={20}
                    color={item.type === 'incoming' ? '#2E7D32' : '#C62828'}
                  />
                </View>

                <View style={styles.transactionDetails}>
                  <View style={styles.transactionRow}>
                    <Text style={styles.transactionTitle}>{item.title}</Text>
                    <Text style={[
                      styles.transactionAmount,
                      { color: item.type === 'incoming' ? '#2E7D32' : '#C62828' }
                    ]}>
                      {item.amount}
                    </Text>
                  </View>

                  <Text style={styles.transactionName}>{item.name}</Text>
                  <Text style={styles.transactionDate}>{item.date}</Text>

                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: item.status === 'Completed' ? '#E8F5E9' : '#FFF3E0' }
                  ]}>
                    {item.status === 'Completed' && (
                      <Icon name="check-circle" size={12} color="#2E7D32" style={{ marginRight: 4 }} />
                    )}
                    {item.status === 'Processing' && (
                      <Icon name="access-time" size={12} color="#EF6C00" style={{ marginRight: 4 }} />
                    )}
                    <Text style={[
                      styles.statusText,
                      { color: item.status === 'Completed' ? '#2E7D32' : '#EF6C00' }
                    ]}>
                      {item.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Text style={{ color: '#999' }}>No transactions found</Text>
            </View>
          )}
        </View>

      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Withdraw Funds</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Icon name="close" size={20} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.balanceLabel}>
              Available Balance: <Text style={styles.balanceHighlight}>₹{wallet?.totalPoints || wallet?.balance || '0'}</Text>
            </Text>

            <Text style={styles.inputLabel}>Amount to Withdraw</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbolInput}>₹</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={withdrawAmount}
                onChangeText={(text) => setWithdrawAmount(text.replace(/[^0-9]/g, ''))}
              />
            </View>

            <Text style={styles.inputLabel}>Bank Account</Text>
            <View style={styles.bankCard}>
              <View style={styles.bankIcon}>
                <Icon name="account-balance" size={24} color="#8855FF" />
              </View>
              <View>
                <Text style={styles.bankName}>HDFC Bank ****4567</Text>
                <Text style={styles.bankSubtext}>Primary Account</Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>• Withdrawal usually takes 1-3 business days</Text>
              <Text style={styles.infoText}>• Minimum withdrawal amount: ₹500</Text>
              <Text style={styles.infoText}>• No processing fees</Text>
            </View>

            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: (withdrawAmount && !isWithdrawing) ? '#8855FF' : '#D1D5DB' }]}
              onPress={handleWithdraw}
              disabled={!withdrawAmount || isWithdrawing}
            >
              {isWithdrawing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>Withdraw</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Success Modal Overlay inside the main Modal */}
        {successModalVisible && (
          <View style={styles.successOverlay}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
            // Optional: tap outside to do nothing or close? 
            />
            <View style={styles.successCard}>
              <View style={styles.successIconContainer}>
                <View style={styles.successIconCircle}>
                  <Icon name="check" size={40} color="#fff" />
                </View>
              </View>

              <Text style={styles.successTitle}>Withdraw request is sent</Text>

              <Text style={styles.successMessage}>
                Your withdraw request of ₹{withdrawAmount || '0'} has been sent to MakeUpSeven, actions will be done in 2 business days
              </Text>

              <TouchableOpacity style={styles.successButton} onPress={closeAllModals}>
                <Text style={styles.successButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>

      {/* Statement Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={statementModalVisible}
        onRequestClose={() => setStatementModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setStatementModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Account Statement</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setStatementModalVisible(false)}>
                <Icon name="close" size={20} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.statementOptionsList}>
              <TouchableOpacity style={styles.statementOption}>
                <View>
                  <Text style={styles.optionTitle}>This Month</Text>
                  <Text style={styles.optionSubtitle}>December 2024</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.statementOption}>
                <View>
                  <Text style={styles.optionTitle}>Last Month</Text>
                  <Text style={styles.optionSubtitle}>November 2024</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.statementOption}>
                <View>
                  <Text style={styles.optionTitle}>Last 3 Months</Text>
                  <Text style={styles.optionSubtitle}>Oct - Dec 2024</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.statementOption}>
                <View>
                  <Text style={styles.optionTitle}>Custom Date Range</Text>
                  <Text style={styles.optionSubtitle}>Select your own dates</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.downloadButton} onPress={() => setPdfVisible(true)}>
              <Icon name="file-download" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.downloadButtonText}>Download PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* PDF Preview Modal */}
      <Modal
        animationType="fade"
        transparent={false}
        visible={pdfVisible}
        onRequestClose={() => setPdfVisible(false)}
      >
        <SafeAreaView style={styles.pdfContainer}>
          <TouchableOpacity
            style={styles.pdfCloseButton}
            onPress={() => setPdfVisible(false)}
          >
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.pdfContent}>
            <View style={styles.pdfHeader}>
              <Text style={styles.pdfLogoText}>Makeup<Text style={styles.pdfLogoHighlight}>Seven</Text></Text>
            </View>

            <Text style={styles.pdfSubtitle}>Account statement months</Text>

            <View style={styles.pdfList}>
              <View style={styles.pdfRow}>
                <Text style={styles.pdfRowDate}>September 23 , 25</Text>
                <Text style={styles.pdfRowAmount}>₹1,000</Text>
              </View>
              <View style={styles.pdfRow}>
                <Text style={styles.pdfRowDate}>October 23 , 25</Text>
                <Text style={styles.pdfRowAmount}>₹1,000</Text>
              </View>
              <View style={styles.pdfRow}>
                <Text style={styles.pdfRowDate}>November 23 , 25</Text>
                <Text style={styles.pdfRowAmount}>₹1,000</Text>
              </View>
              <View style={styles.pdfRow}>
                <Text style={styles.pdfRowDate}>December 23 , 25</Text>
                <Text style={styles.pdfRowAmount}>₹1,000</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.black,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#8855FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  amountSymbol: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '500',
    marginRight: 2,
  },
  amountText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  amountDecimal: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 20,
    marginLeft: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
    zIndex: 10,
    elevation: 20, // Ensure it sits above gradient rendering
  },
  withdrawButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  withdrawText: {
    color: '#8855FF',
    fontWeight: '600',
    fontSize: 15,
  },
  statementButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  statementText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  statValue: {
    color: Colors.black,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statGrowth: {
    color: '#2E7D32', // Green
    fontSize: 12,
    fontWeight: '600',
  },
  statNote: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 16,
  },
  transactionsList: {
    gap: 16,
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  transactionName: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    width: '100%',
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  balanceHighlight: {
    color: '#8855FF',
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#8855FF', // Focused state as per design
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 24,
  },
  currencySymbolInput: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    height: '100%',
  },
  bankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 24,
  },
  bankIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3EFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bankName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  bankSubtext: {
    fontSize: 12,
    color: '#666',
  },
  infoBox: {
    backgroundColor: '#FFF8F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
    lineHeight: 18,
  },
  confirmButton: {
    backgroundColor: '#B599FF',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)', // Slightly darker to dim the underlying modal
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    padding: 24,
  },
  successCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8855FF', // Purple circle
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#EFE9FF', // Lighter purple rim
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  successButton: {
    backgroundColor: '#8855FF', // Strong purple
    borderRadius: 16,
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statementOptionsList: {
    gap: 16,
    marginBottom: 24,
  },
  statementOption: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  downloadButton: {
    backgroundColor: '#8855FF',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pdfCloseButton: {
    alignSelf: 'flex-end',
    padding: 16,
  },
  pdfContent: {
    padding: 24,
    marginTop: 20,
  },
  pdfHeader: {
    marginBottom: 40,
  },
  pdfLogoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  pdfLogoHighlight: {
    color: '#8855FF',
  },
  pdfSubtitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 32,
  },
  pdfList: {
    gap: 32,
  },
  pdfRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pdfRowDate: {
    fontSize: 16,
    color: '#000',
  },
  pdfRowAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default ArtistWalletScreen;
