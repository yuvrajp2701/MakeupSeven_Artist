import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import WebView from 'react-native-webview';
import { Slider } from '@miblanchard/react-native-slider';
import InputGroup from '../InputGroup';
import DropdownField from '../DropdownField';
import styles from './styles/createArtistStyles';

interface Props {
    // Personal info
    fullName: string;
    setFullName: (v: string) => void;
    mobile: string;
    setMobile: (v: string) => void;
    email: string;
    setEmail: (v: string) => void;
    gender: string;
    setGender: (v: string) => void;
    language: string;
    setLanguage: (v: string) => void;

    // Location
    city: string;
    area: string;
    setArea: (v: string) => void;
    pincode: string;
    setPincode: (v: string) => void;
    geocoding: boolean;
    latitude: number | null;
    longitude: number | null;
    mapAddress: string;
    setLatitude: (v: number) => void;
    setLongitude: (v: number) => void;
    radius: number;
    setRadius: (v: number) => void;
    geocodePincode: (code: string) => void;

    // Professional
    category: string;
    setCategory: (v: string) => void;
    experience: string;
    setExperience: (v: string) => void;
    specialization: string;
    setSpecialization: (v: string) => void;
    setCity: (v: string) => void;

    // KYC
    documentNumber: string;
    setDocumentNumber: (v: string) => void;
    documentImages: any[];
    setDocumentImages: (v: any[]) => void;
    pickDocument: (setter: (v: any) => void) => void;

    // Profile Photo
    profilePhoto: any;
    setProfilePhoto: (v: any) => void;
    pickImage: (setter: (v: any) => void) => void;

    // Dropdown helper
    openDropdown: (
        options: string[],
        setValue: (val: string) => void,
        layout: { x: number; y: number; width: number; height: number }
    ) => void;
}

const ProfileInfoStep: React.FC<Props> = ({
    fullName, setFullName,
    mobile, setMobile,
    email, setEmail,
    gender, setGender,
    language, setLanguage,
    city, setCity,
    area, setArea,
    pincode, setPincode,
    geocoding, latitude, longitude, mapAddress,
    setLatitude, setLongitude,
    radius, setRadius,
    geocodePincode,
    category, setCategory,
    experience, setExperience,
    specialization, setSpecialization,
    documentNumber, setDocumentNumber,
    documentImages, setDocumentImages,
    pickDocument,
    profilePhoto, setProfilePhoto,
    pickImage,
    openDropdown,
}) => {
    return (
        <>
            {/* ── Personal Information ── */}
            <Text style={styles.sectionHeader}>Personal Information</Text>

            <Text style={styles.fieldLabel}>Profile Photo</Text>
            <TouchableOpacity
                style={styles.uploadBox}
                activeOpacity={0.8}
                onPress={() => pickImage(setProfilePhoto)}
            >
                {profilePhoto ? (
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <Image source={{ uri: profilePhoto.uri }} style={{ width: 80, height: 80, borderRadius: 40 }} />
                        <Text style={{ fontSize: 12, marginTop: 8, color: '#7C3AED' }}>Change Photo</Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.uploadIconCircle}>
                            <FontAwesome name="image" size={20} color="#7C3AED" />
                        </View>
                        <Text style={styles.uploadTitle}>Upload Profile Photo</Text>
                        <Text style={styles.uploadSubtitle}>PNG, JPG up to 10MB</Text>
                    </>
                )}
            </TouchableOpacity>

            <InputGroup label="Full name" placeholder="Enter your full name" value={fullName} onChangeText={setFullName} />
            <InputGroup label="Mobile number" placeholder="Enter your mobile number" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
            <InputGroup label="Email address" placeholder="your email address" value={email} onChangeText={setEmail} keyboardType="email-address" icon="envelope-o" />

            <DropdownField label="Gender" value={gender} placeholder="Select gender"
                onPress={(layout: any) => openDropdown(['Male', 'Female', 'Other'], setGender, layout)} />

            <DropdownField label="Language spoken" value={language} placeholder="Select language"
                onPress={(layout: any) => openDropdown(['English', 'Hindi', 'Marathi', 'Gujarati'], setLanguage, layout)} />

            {/* ── Location & Services Area ── */}
            <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Location & Services Area</Text>

            <DropdownField label="City" value={city} placeholder="Select your city"
                onPress={(layout: any) => openDropdown(['Mumbai', 'Delhi', 'Bangalore', 'Pune'], setCity, layout)} />

            <InputGroup label="Area / locality" placeholder="Enter your area or locality" value={area} onChangeText={setArea} />
            <InputGroup
                label="Pincode"
                placeholder="Enter pin code"
                value={pincode}
                onChangeText={(val: string) => {
                    setPincode(val);
                    if (val.length === 6) { geocodePincode(val); }
                    else { setLatitude(null as any); setLongitude(null as any); }
                }}
                keyboardType="numeric"
            />

            {geocoding && (
                <View style={styles.mapLoadingBox}>
                    <ActivityIndicator size="small" color="#7C3AED" />
                    <Text style={styles.mapLoadingText}>Fetching location for pincode...</Text>
                </View>
            )}

            {latitude !== null && longitude !== null && !geocoding && (
                <View style={styles.mapContainer}>
                    <View style={styles.mapHeaderRow}>
                        <FontAwesome name="map-marker" size={16} color="#7C3AED" />
                        <Text style={styles.mapLabel}>{'  '}Confirm your location</Text>
                    </View>
                    {mapAddress ? <Text style={styles.mapAddressText} numberOfLines={2}>{mapAddress}</Text> : null}
                    <Text style={styles.mapHintText}>Drag the pin to set your exact location</Text>

                    <View style={styles.mapImageWrapper}>
                        <WebView
                            style={styles.map}
                            originWhitelist={['*']}
                            javaScriptEnabled
                            scrollEnabled={false}
                            source={{
                                html: `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>* { margin:0; padding:0; box-sizing:border-box; } html,body,#map { width:100%; height:100%; }</style>
</head>
<body>
  <div id="map"></div>
  <script>
    var lat=${latitude.toFixed(6)}, lng=${longitude.toFixed(6)};
    var map = L.map('map', { zoomControl:true }).setView([lat,lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'\u00a9 OSM' }).addTo(map);
    var icon = L.divIcon({
      html:'<div style="width:26px;height:26px;background:#7C3AED;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 3px 10px rgba(124,58,237,0.6);"></div>',
      iconSize:[26,26], iconAnchor:[13,26], className:''
    });
    var marker = L.marker([lat,lng],{icon:icon,draggable:true}).addTo(map);
    function send(latlng){
      if(window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify({lat:latlng.lat.toFixed(6),lng:latlng.lng.toFixed(6)}));
    }
    marker.on('dragend', e => send(e.target.getLatLng()));
    map.on('click', e => { marker.setLatLng(e.latlng); send(e.latlng); });
  </script>
</body></html>`,
                            }}
                            onMessage={(e: any) => {
                                try {
                                    const { lat, lng } = JSON.parse(e.nativeEvent.data);
                                    setLatitude(parseFloat(lat));
                                    setLongitude(parseFloat(lng));
                                } catch (_) { }
                            }}
                        />
                    </View>

                    <View style={styles.mapCoordsRow}>
                        <FontAwesome name="crosshairs" size={13} color="#6B7280" />
                        <Text style={styles.mapCoordsText}>{'  '}{latitude.toFixed(5)}, {longitude.toFixed(5)}</Text>
                    </View>
                </View>
            )}

            {/* Service Radius */}
            <Text style={styles.fieldLabel}>Service radius</Text>
            <Slider
                value={radius}
                minimumValue={5}
                maximumValue={100}
                step={1}
                onValueChange={(val) => setRadius(val[0])}
                minimumTrackTintColor="#7C3AED"
                maximumTrackTintColor="#F3F4F6"
                thumbTintColor="#7C3AED"
                trackStyle={{ height: 10, borderRadius: 5 }}
                thumbStyle={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#7C3AED' }}
            />
            <View style={styles.radiusInfoRow}>
                <Text style={styles.radiusValueText}>{Math.round(radius)} km</Text>
                <Text style={styles.radiusHelperText}>Customer within this radius can book your service</Text>
            </View>

            {/* ── Professional overview ── */}
            <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Professional overview</Text>

            <DropdownField label="Select your primary category" value={category} placeholder="Select primary category"
                onPress={(layout: any) => openDropdown(['Makeup', 'Hair Styling', 'Nail Art', 'Mehendi'], setCategory, layout)} />

            <DropdownField label="Experience" value={experience} placeholder="Select your experience level"
                onPress={(layout: any) => openDropdown(['Fresher (0-1 y)', 'Mid-level (2-5 y)', 'Senior (5+ y)'], setExperience, layout)} />

            <DropdownField label="Specialization" value={specialization} placeholder="Select specialization"
                onPress={(layout: any) => openDropdown(['Bridal Makeup', 'Party Makeup', 'Editorial'], setSpecialization, layout)} />

            {/* ── KYC Documents Section ── */}
            <Text style={[styles.sectionHeader, { marginTop: 28 }]}>KYC Documents</Text>
            <Text style={styles.helperText}>Required for artist verification. Kept private and secure.</Text>

            {/* Document (replacing Aadhaar) */}
            <View style={styles.kycCard}>
                <View style={styles.kycCardHeader}>
                    <View style={styles.kycIconBadge}>
                        <FontAwesome name="paperclip" size={16} color="#7C3AED" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.kycCardTitle}>Document</Text>
                        <Text style={styles.kycCardSub}>Attach identification document (PDF, PNG, JPG)</Text>
                    </View>
                    {documentImages.length > 0 && (
                        <View style={styles.kycDoneBadge}>
                            <FontAwesome name="check" size={11} color="#fff" />
                        </View>
                    )}
                </View>

                <InputGroup
                    label="Document Number"
                    placeholder="Enter ID number"
                    value={documentNumber}
                    onChangeText={setDocumentNumber}
                />

                <View style={styles.kycImagesRow}>
                    {/* Multifile Upload Slot */}
                    <View style={{ width: '100%' }}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                            {documentImages.map((img, idx) => (
                                <View key={idx} style={[styles.kycPreviewWrapper, { width: '47%' }]}>
                                    {img.type?.includes('image') ? (
                                        <Image source={{ uri: img.uri }} style={styles.kycPreview} resizeMode="cover" />
                                    ) : (
                                        <View style={[styles.kycPreview, { backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }]}>
                                            <FontAwesome name="file-text-o" size={30} color="#7C3AED" />
                                            <Text style={{ fontSize: 10, marginTop: 5, paddingHorizontal: 5 }} numberOfLines={1}>{img.name}</Text>
                                        </View>
                                    )}
                                    <TouchableOpacity
                                        style={styles.kycRemoveBtn}
                                        onPress={() => setDocumentImages(documentImages.filter((_, i) => i !== idx))}
                                    >
                                        <FontAwesome name="times" size={11} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            <TouchableOpacity
                                style={[styles.kycUploadBox, { width: '47%', minHeight: 100 }]}
                                onPress={() => pickDocument((file) => setDocumentImages([...documentImages, file]))}
                            >
                                <FontAwesome name="paperclip" size={22} color="#7C3AED" />
                                <Text style={styles.kycUploadText}>Attach File</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </>
    );
};

export default ProfileInfoStep;
