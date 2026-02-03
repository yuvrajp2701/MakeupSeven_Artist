// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   Pressable,
//   Modal,
//   FlatList,
//   StyleSheet,
// } from 'react-native';
// import FontAwesome from '@react-native-vector-icons/fontawesome';

// const Dropdown = ({ label, placeholder, options = [], value, onSelect }: any) => {
//   const [visible, setVisible] = useState(false);

//   return (
//     <View style={styles.wrapper}>
//       {/* LABEL */}
//       <Text style={styles.label}>{label}</Text>

//       {/* FIELD */}
//       <Pressable
//         style={styles.dropdown}
//         onPress={() => setVisible(true)}
//       >
//         <Text
//           style={[
//             styles.dropdownText,
//             value && { color: '#111827' },
//           ]}
//         >
//           {value || placeholder}
//         </Text>
//         <FontAwesome name="chevron-down" size={12} color="#6B7280" />
//       </Pressable>

//       {/* MODAL */}
//       <Modal
//         transparent
//         visible={visible}
//         animationType="fade"
//       >
//         {/* OVERLAY (tap outside closes) */}
//         <Pressable
//           style={styles.overlay}
//           onPress={() => setVisible(false)}
//         >
//           {/* LIST (prevents closing when tapped) */}
//           <Pressable style={styles.listContainer}>
//             <FlatList
//               data={options}
//               keyExtractor={(item) => item}
//               renderItem={({ item }) => (
//                 <Pressable
//                   style={styles.option}
//                   onPress={() => {
//                     if (onSelect) onSelect(item);
//                     setVisible(false);
//                   }}
//                 >
//                   <Text style={styles.optionText}>{item}</Text>
//                 </Pressable>
//               )}
//             />
//           </Pressable>
//         </Pressable>
//       </Modal>
//     </View>
//   );
// };

// export default Dropdown;

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   wrapper: {
//     marginBottom: 14,
//   },

//   label: {
//     fontSize: 13,
//     color: '#374151',
//     marginBottom: 6,
//   },

//   dropdown: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     paddingVertical: 14,
//   },

//   dropdownText: {
//     fontSize: 14,
//     color: '#9CA3AF',
//   },

//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.15)',
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//   },

//   listContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     maxHeight: 300,
//     overflow: 'hidden',
//   },

//   option: {
//     paddingVertical: 16,
//     paddingHorizontal: 18,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },

//   optionText: {
//     fontSize: 14,
//     color: '#111827',
//   },
// });
