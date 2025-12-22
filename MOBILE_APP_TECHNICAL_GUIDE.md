# 📱 AMG Real Estate Mobile App - الدليل التقني الشامل

## 🎯 التوصية النهائية: React Native + Expo

بناءً على تحليل شامل للمشروع، **React Native مع Expo** هو الخيار الأمثل للأسباب التالية:

✅ **نفس اللغة**: TypeScript (زي الموقع تماماً)  
✅ **توفير الوقت**: تطوير أسرع بـ 50%  
✅ **منصتين بكود واحد**: iOS + Android  
✅ **مشاركة الكود**: من الويب للموبايل  
✅ **Ecosystem ضخم**: آلاف المكتبات الجاهزة  
✅ **تصميم احترافي**: قادر على تصميمات World-Class  

---

## 🛠️ التقنيات والمكتبات المطلوبة

### 📦 Core Framework

```bash
# إنشاء المشروع
npx create-expo-app amg-real-estate --template blank-typescript

# الاعتماديات الأساسية
{
  "expo": "~50.0.0",
  "react": "18.2.0",
  "react-native": "0.73.2",
  "typescript": "^5.3.3"
}
```

### 🎨 UI Libraries & Components

#### 1. React Native Paper (Material Design 3) ⭐ مُوصَى به
```bash
npm install react-native-paper react-native-safe-area-context
```

**المميزات:**
- ✅ Material Design 3 الأحدث
- ✅ 50+ Component جاهز وجميل
- ✅ Dark Mode مدمج
- ✅ RTL Support كامل
- ✅ Theming سهل
- ✅ Accessibility مدمج
- ✅ Animations سلسة

**الاستخدام:**
```typescript
import { Button, Card, TextInput, FAB, Chip } from 'react-native-paper'
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper'

// Custom Theme
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#3b82f6',
    secondary: '#10b981',
    tertiary: '#f97316',
  },
  roundness: 12,
}

// في الكود
<Card mode="elevated" style={styles.card}>
  <Card.Cover source={{ uri: imageUrl }} />
  <Card.Title title="فيلا فاخرة" subtitle="التجمع الخامس" />
  <Card.Content>
    <Text variant="bodyMedium">8,500,000 جنيه</Text>
  </Card.Content>
  <Card.Actions>
    <Button mode="contained">عرض التفاصيل</Button>
  </Card.Actions>
</Card>
```

#### 2. NativeBase (بديل ممتاز)
```bash
npm install native-base react-native-svg
```

**الاستخدام:**
```typescript
import { Box, VStack, HStack, Text, Button, Image } from 'native-base'

<Box bg="white" rounded="xl" shadow={2} p={4}>
  <Image source={{ uri: imageUrl }} alt="Property" h={200} rounded="lg" />
  <VStack space={2} mt={3}>
    <Text fontSize="xl" fontWeight="bold">فيلا فاخرة</Text>
    <HStack space={2} alignItems="center">
      <Icon as={Ionicons} name="location" />
      <Text>التجمع الخامس</Text>
    </HStack>
    <Button colorScheme="blue">عرض التفاصيل</Button>
  </VStack>
</Box>
```

#### 3. React Native Elements (خيار ثالث)
```bash
npm install @rneui/themed @rneui/base
```

### 🧭 Navigation

```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
```

**الهيكل المقترح:**
```typescript
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// Bottom Tabs (الشاشات الرئيسية)
const Tab = createBottomTabNavigator()

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'الرئيسية',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tab.Screen name="Projects" component={ProjectsScreen} 
        options={{ tabBarLabel: 'المشاريع' }} 
      />
      <Tab.Screen name="Properties" component={PropertiesScreen}
        options={{ tabBarLabel: 'العقارات' }}
      />
      <Tab.Screen name="Services" component={ServicesScreen}
        options={{ tabBarLabel: 'الخدمات' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{ tabBarLabel: 'حسابي' }}
      />
    </Tab.Navigator>
  )
}

// Stack Navigator (للصفحات الداخلية)
const Stack = createNativeStackNavigator()

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainTabs" component={MainTabs} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
        <Stack.Screen name="AddProperty" component={AddPropertyScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
```

### 🎭 Animations & Gestures

#### React Native Reanimated (الأفضل للـ Animations)
```bash
npm install react-native-reanimated
npx expo install react-native-reanimated
```

**أمثلة Animations:**
```typescript
import Animated, {
  FadeInUp,
  FadeOut,
  Layout,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'

// Fade In Animation
<Animated.View entering={FadeInUp.delay(200).springify()}>
  <PropertyCard property={property} />
</Animated.View>

// Layout Animation
<Animated.View layout={Layout.springify()}>
  {/* Content */}
</Animated.View>

// Custom Animation
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: withSpring(isPressed ? 0.95 : 1) }],
}))
```

#### React Native Gesture Handler
```bash
npm install react-native-gesture-handler
```

**Swipeable Cards:**
```typescript
import { Swipeable } from 'react-native-gesture-handler'

<Swipeable
  renderRightActions={() => (
    <View style={styles.rightActions}>
      <Button icon="heart" onPress={handleSave} />
      <Button icon="share" onPress={handleShare} />
    </View>
  )}
>
  <PropertyCard />
</Swipeable>
```

### 🌐 API & State Management

#### 1. TanStack Query (React Query) - الأفضل لإدارة الـ APIs
```bash
npm install @tanstack/react-query
```

**الاستخدام:**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Fetching Properties
function PropertiesScreen() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const response = await axios.get('https://amg-realestate.vercel.app/api/properties')
      return response.data
    },
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage />

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <PropertyCard property={item} />}
    />
  )
}

// Adding Property (Mutation)
function AddPropertyScreen() {
  const queryClient = useQueryClient()
  
  const mutation = useMutation({
    mutationFn: async (propertyData) => {
      return await axios.post('/api/properties', propertyData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      navigation.goBack()
    },
  })

  return (
    <Button onPress={() => mutation.mutate(formData)}>
      نشر العقار
    </Button>
  )
}
```

#### 2. Zustand (State Management بسيط وقوي)
```bash
npm install zustand
```

**الاستخدام:**
```typescript
import { create } from 'zustand'

// Auth Store
export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
  updateUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),
}))

// في الكومبوننت
function ProfileScreen() {
  const { user, logout } = useAuthStore()
  
  return (
    <View>
      <Text>مرحباً {user?.name}</Text>
      <Button onPress={logout}>تسجيل الخروج</Button>
    </View>
  )
}

// Filters Store
export const useFiltersStore = create((set) => ({
  type: null,
  priceMin: null,
  priceMax: null,
  city: null,
  
  setFilter: (key, value) => set({ [key]: value }),
  resetFilters: () => set({ type: null, priceMin: null, priceMax: null, city: null }),
}))
```

#### 3. Axios (HTTP Client)
```bash
npm install axios
```

**Setup:**
```typescript
import axios from 'axios'
import { useAuthStore } from './stores/authStore'

const api = axios.create({
  baseURL: 'https://amg-realestate.vercel.app/api',
  timeout: 10000,
})

// Request Interceptor (إضافة التوكن)
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response Interceptor (معالجة الأخطاء)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

export default api
```

### 📝 Forms & Validation

```bash
npm install react-hook-form zod @hookform/resolvers
```

**نموذج إضافة عقار:**
```typescript
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const propertySchema = z.object({
  title: z.string().min(5, 'العنوان يجب أن يكون 5 حروف على الأقل'),
  description: z.string().min(20, 'الوصف قصير جداً'),
  price: z.number().positive('السعر يجب أن يكون أكبر من صفر'),
  type: z.enum(['APARTMENT', 'VILLA', 'OFFICE', 'SHOP', 'LAND']),
  area: z.number().positive(),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  location: z.string().min(3),
  city: z.string().min(2),
})

type PropertyFormData = z.infer<typeof propertySchema>

function AddPropertyScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
  })

  const onSubmit = (data: PropertyFormData) => {
    console.log('Valid data:', data)
    // Submit to API
  }

  return (
    <ScrollView>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="عنوان العقار"
            value={value}
            onChangeText={onChange}
            error={!!errors.title}
          />
        )}
      />
      {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

      <Button onPress={handleSubmit(onSubmit)}>
        نشر العقار
      </Button>
    </ScrollView>
  )
}
```

### 📸 Images & Media

#### 1. Expo Image Picker
```bash
npx expo install expo-image-picker
```

**الاستخدام:**
```typescript
import * as ImagePicker from 'expo-image-picker'

async function pickImages() {
  // طلب الإذن
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (status !== 'granted') {
    alert('نحتاج إذن الوصول للصور')
    return
  }

  // اختيار صور متعددة
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 0.8,
    aspect: [16, 9],
  })

  if (!result.canceled) {
    setImages(result.assets.map(asset => asset.uri))
  }
}

// التقاط صورة من الكاميرا
async function takePhoto() {
  const { status } = await ImagePicker.requestCameraPermissionsAsync()
  if (status !== 'granted') return

  const result = await ImagePicker.launchCameraAsync({
    quality: 0.8,
    aspect: [16, 9],
  })

  if (!result.canceled) {
    setImage(result.assets[0].uri)
  }
}
```

#### 2. Expo Image (أفضل من Image)
```bash
npx expo install expo-image
```

**المميزات:**
- ✅ Caching تلقائي
- ✅ Placeholder و Blur
- ✅ أداء أفضل
- ✅ تحميل أسرع

```typescript
import { Image } from 'expo-image'

<Image
  source={{ uri: property.images[0] }}
  placeholder={blurhash} // Blur effect
  contentFit="cover"
  transition={200}
  style={{ width: '100%', height: 250 }}
/>
```

#### 3. رفع الصور على Cloudinary
```typescript
async function uploadToCloudinary(imageUri: string) {
  const formData = new FormData()
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'property-image.jpg',
  })
  formData.append('upload_preset', 'amg_properties') // من إعدادات Cloudinary

  const response = await fetch(
    'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload',
    {
      method: 'POST',
      body: formData,
    }
  )

  const data = await response.json()
  return data.secure_url // URL الصورة
}

// استخدام مع React Query
const uploadMutation = useMutation({
  mutationFn: uploadToCloudinary,
  onSuccess: (url) => {
    setUploadedImages([...uploadedImages, url])
  },
})
```

#### 4. Image Gallery
```bash
npm install react-native-image-viewing
```

```typescript
import ImageViewing from 'react-native-image-viewing'

const [visible, setVisible] = useState(false)
const [imageIndex, setImageIndex] = useState(0)

<ImageViewing
  images={property.images.map(uri => ({ uri }))}
  imageIndex={imageIndex}
  visible={visible}
  onRequestClose={() => setVisible(false)}
/>
```

### 🗺️ Maps & Location

#### Expo Location
```bash
npx expo install expo-location
```

**الاستخدام:**
```typescript
import * as Location from 'expo-location'

async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync()
  if (status !== 'granted') return

  const location = await Location.getCurrentPositionAsync({})
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  }
}

async function reverseGeocode(lat: number, lng: number) {
  const result = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng })
  if (result[0]) {
    return `${result[0].city}, ${result[0].country}`
  }
}
```

#### React Native Maps
```bash
npx expo install react-native-maps
```

**الاستخدام:**
```typescript
import MapView, { Marker } from 'react-native-maps'

<MapView
  style={{ flex: 1 }}
  initialRegion={{
    latitude: 30.0444,
    longitude: 31.2357,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }}
>
  {properties.map((property) => (
    <Marker
      key={property.id}
      coordinate={{
        latitude: property.latitude,
        longitude: property.longitude,
      }}
      title={property.title}
      description={`${property.price} جنيه`}
      onPress={() => navigation.navigate('PropertyDetails', { id: property.id })}
    >
      <View style={styles.customMarker}>
        <Text>{property.price}</Text>
      </View>
    </Marker>
  ))}
</MapView>
```

### 🔔 Push Notifications

#### Expo Notifications + Firebase
```bash
npx expo install expo-notifications expo-device expo-constants
```

**Setup:**
```typescript
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'

// إعدادات الإشعارات
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

// طلب الإذن
async function registerForPushNotifications() {
  if (!Device.isDevice) {
    alert('الإشعارات تعمل على الأجهزة الحقيقية فقط')
    return
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    alert('فشل الحصول على إذن الإشعارات')
    return
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: 'your-project-id',
  })

  // إرسال التوكن للـ Backend
  await api.post('/api/user/push-token', { token: token.data })

  return token.data
}

// الاستماع للإشعارات
useEffect(() => {
  const subscription = Notifications.addNotificationReceivedListener((notification) => {
    console.log('Notification received:', notification)
  })

  const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
    console.log('Notification tapped:', response)
    // Navigate to specific screen
  })

  return () => {
    subscription.remove()
    responseSubscription.remove()
  }
}, [])

// إرسال إشعار محلي
async function sendLocalNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'عقار جديد! 🏠',
      body: 'تم إضافة فيلا فاخرة في التجمع الخامس',
      data: { propertyId: '123' },
    },
    trigger: { seconds: 2 },
  })
}
```

### 💾 Storage & Caching

#### Expo SecureStore (للبيانات الحساسة)
```bash
npx expo install expo-secure-store
```

```typescript
import * as SecureStore from 'expo-secure-store'

// حفظ التوكن
await SecureStore.setItemAsync('authToken', token)

// قراءة التوكن
const token = await SecureStore.getItemAsync('authToken')

// حذف التوكن
await SecureStore.deleteItemAsync('authToken')
```

#### AsyncStorage (للبيانات العادية)
```bash
npm install @react-native-async-storage/async-storage
```

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'

// حفظ
await AsyncStorage.setItem('theme', 'dark')

// قراءة
const theme = await AsyncStorage.getItem('theme')

// حفظ كائن JSON
await AsyncStorage.setItem('user', JSON.stringify(userData))

// قراءة كائن JSON
const user = JSON.parse(await AsyncStorage.getItem('user'))
```

### 🌐 Internationalization (i18n)

```bash
npm install i18next react-i18next
```

**Setup:**
```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'

const resources = {
  ar: {
    translation: {
      home: 'الرئيسية',
      properties: 'العقارات',
      projects: 'المشاريع',
      services: 'الخدمات',
      profile: 'حسابي',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      addProperty: 'إضافة عقار',
      price: 'السعر',
      area: 'المساحة',
      location: 'الموقع',
    },
  },
  en: {
    translation: {
      home: 'Home',
      properties: 'Properties',
      projects: 'Projects',
      services: 'Services',
      profile: 'Profile',
      login: 'Login',
      register: 'Register',
      addProperty: 'Add Property',
      price: 'Price',
      area: 'Area',
      location: 'Location',
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: Localization.locale.startsWith('ar') ? 'ar' : 'en',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
```

**الاستخدام:**
```typescript
import { useTranslation } from 'react-i18next'
import { I18nManager } from 'react-native'

function HomeScreen() {
  const { t, i18n } = useTranslation()

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang)
    
    // تغيير اتجاه الـ Layout
    const isRTL = lang === 'ar'
    I18nManager.forceRTL(isRTL)
    
    // إعادة تشغيل التطبيق
    Updates.reloadAsync()
  }

  return (
    <View>
      <Text>{t('home')}</Text>
      <Button onPress={() => changeLanguage('en')}>English</Button>
      <Button onPress={() => changeLanguage('ar')}>العربية</Button>
    </View>
  )
}
```

### 📊 Analytics

```bash
npx expo install expo-firebase-analytics
```

```typescript
import * as Analytics from 'expo-firebase-analytics'

// تسجيل حدث
await Analytics.logEvent('property_view', {
  propertyId: property.id,
  propertyType: property.type,
  price: property.price,
})

// تسجيل شاشة
await Analytics.setCurrentScreen('PropertyDetails')

// تسجيل مستخدم
await Analytics.setUserId(user.id)

// خصائص المستخدم
await Analytics.setUserProperties({
  account_type: user.role,
  city: user.city,
})
```

### 🎨 UI Enhancements

#### 1. Loading Skeletons
```bash
npm install react-native-skeleton-placeholder
```

```typescript
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

function PropertyCardSkeleton() {
  return (
    <SkeletonPlaceholder>
      <View style={{ width: '100%', height: 300, borderRadius: 12 }}>
        <View style={{ width: '100%', height: 200 }} />
        <View style={{ marginTop: 10, width: '80%', height: 20 }} />
        <View style={{ marginTop: 8, width: '60%', height: 16 }} />
      </View>
    </SkeletonPlaceholder>
  )
}
```

#### 2. Bottom Sheet
```bash
npm install @gorhom/bottom-sheet
```

```typescript
import BottomSheet from '@gorhom/bottom-sheet'

function PropertiesScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null)

  return (
    <>
      <FlatList data={properties} />
      
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['25%', '50%', '90%']}
        index={0}
      >
        <View style={styles.filterPanel}>
          <Text style={styles.title}>الفلاتر</Text>
          {/* Filter Options */}
        </View>
      </BottomSheet>
    </>
  )
}
```

#### 3. Lottie Animations
```bash
npm install lottie-react-native
```

```typescript
import LottieView from 'lottie-react-native'

<LottieView
  source={require('./assets/loading.json')}
  autoPlay
  loop
  style={{ width: 200, height: 200 }}
/>
```

#### 4. Linear Gradient
```bash
npx expo install expo-linear-gradient
```

```typescript
import { LinearGradient } from 'expo-linear-gradient'

<LinearGradient
  colors={['#3b82f6', '#8b5cf6', '#10b981']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.gradient}
>
  <Text style={styles.heroText}>AMG Real Estate</Text>
</LinearGradient>
```

#### 5. Blur View
```bash
npx expo install expo-blur
```

```typescript
import { BlurView } from 'expo-blur'

<ImageBackground source={{ uri: imageUrl }}>
  <BlurView intensity={80} tint="dark" style={styles.overlay}>
    <Text style={styles.title}>فيلا فاخرة</Text>
    <Text style={styles.price}>8,500,000 جنيه</Text>
  </BlurView>
</ImageBackground>
```

---

## 🎨 دليل التصميم (Design System)

### الألوان (Colors)

```typescript
export const Colors = {
  // Primary Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main Blue
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Secondary (Green)
  secondary: {
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  },
  
  // Accent (Orange)
  accent: {
    500: '#f97316',
    600: '#ea580c',
  },
  
  // Neutrals
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Status Colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Background
  background: {
    light: '#ffffff',
    dark: '#111827',
  },
  
  // Text
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
  },
}
```

### التايبوغرافي (Typography)

```typescript
export const Typography = {
  // Font Families
  fontFamily: {
    arabic: 'Cairo',
    english: 'Inter',
    arabicBold: 'Cairo-Bold',
    englishBold: 'Inter-Bold',
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Font Weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
}
```

### المسافات (Spacing)

```typescript
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
}
```

### Border Radius

```typescript
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
}
```

### الظلال (Shadows)

```typescript
export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
}
```

---

## 🎭 أمثلة Components جاهزة

### 1. PropertyCard Component

```typescript
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'

interface PropertyCardProps {
  property: {
    id: string
    title: string
    price: number
    area: number
    bedrooms: number
    bathrooms: number
    location: string
    images: string[]
    type: string
  }
  onPress: () => void
  index: number
}

export function PropertyCard({ property, onPress, index }: PropertyCardProps) {
  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 100).springify()}
      style={styles.container}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View style={styles.card}>
          {/* Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: property.images[0] }}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
            
            {/* Gradient Overlay */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.gradient}
            />
            
            {/* Type Badge */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{property.type}</Text>
            </View>
            
            {/* Favorite Button */}
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>
              {property.title}
            </Text>
            
            <View style={styles.location}>
              <Ionicons name="location" size={16} color="#6b7280" />
              <Text style={styles.locationText}>{property.location}</Text>
            </View>

            <View style={styles.features}>
              <View style={styles.feature}>
                <Ionicons name="bed" size={16} color="#6b7280" />
                <Text style={styles.featureText}>{property.bedrooms}</Text>
              </View>
              
              <View style={styles.feature}>
                <Ionicons name="water" size={16} color="#6b7280" />
                <Text style={styles.featureText}>{property.bathrooms}</Text>
              </View>
              
              <View style={styles.feature}>
                <Ionicons name="resize" size={16} color="#6b7280" />
                <Text style={styles.featureText}>{property.area} م²</Text>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.price}>
                {property.price.toLocaleString('ar-EG')} جنيه
              </Text>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>عرض التفاصيل</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    height: 220,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  features: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3b82f6',
  },
  viewButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
})
```

### 2. SearchBar Component

```typescript
import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  onFilter?: () => void
}

export function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = 'ابحث عن عقار...', 
  onFilter 
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#6b7280" />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')}>
            <Ionicons name="close-circle" size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>
      
      {onFilter && (
        <TouchableOpacity style={styles.filterButton} onPress={onFilter}>
          <Ionicons name="options" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  filterButton: {
    backgroundColor: '#3b82f6',
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
```

### 3. EmptyState Component

```typescript
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import LottieView from 'lottie-react-native'
import { Button } from 'react-native-paper'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animations/empty.json')}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction && (
        <Button mode="contained" onPress={onAction} style={styles.button}>
          {actionLabel}
        </Button>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  animation: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
  },
})
```

---

## 📂 هيكل المشروع المقترح

```
amg-real-estate/
├── app/
│   ├── (tabs)/
│   │   ├── home.tsx
│   │   ├── properties.tsx
│   │   ├── projects.tsx
│   │   ├── services.tsx
│   │   └── profile.tsx
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── property/
│   │   ├── [id].tsx
│   │   └── add.tsx
│   ├── project/
│   │   └── [id].tsx
│   ├── service/
│   │   └── [slug].tsx
│   └── _layout.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── SearchBar.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   ├── property/
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyList.tsx
│   │   ├── PropertyFilters.tsx
│   │   └── PropertyDetails.tsx
│   ├── project/
│   │   ├── ProjectCard.tsx
│   │   └── ProjectList.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── TabBar.tsx
│       └── Container.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   ├── properties.ts
│   │   ├── projects.ts
│   │   ├── services.ts
│   │   ├── auth.ts
│   │   └── user.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useProperties.ts
│   │   ├── useProjects.ts
│   │   └── useNotifications.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── filtersStore.ts
│   │   └── favoritesStore.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── helpers.ts
│   └── constants/
│       ├── colors.ts
│       ├── typography.ts
│       └── config.ts
├── assets/
│   ├── fonts/
│   ├── images/
│   ├── icons/
│   └── animations/
├── types/
│   ├── property.ts
│   ├── project.ts
│   ├── user.ts
│   └── api.ts
├── app.json
├── package.json
└── tsconfig.json
```

---

## ⚡ خطة التطوير (10 أسابيع)

### الأسبوع 1-2: Setup + Authentication
- [x] إنشاء المشروع بـ Expo
- [x] Setup Navigation (Stack + Tabs)
- [x] Setup API Client (Axios + React Query)
- [x] Theme System (Colors, Typography, Spacing)
- [x] Auth Screens (Login, Register, Forgot Password)
- [x] Auth API Integration
- [x] JWT Token Management
- [x] Biometric Authentication (Face ID / Fingerprint)

### الأسبوع 3-4: Home + Properties
- [x] Home Screen (Hero, Stats, Featured)
- [x] Properties List (Grid/List View)
- [x] Property Card Component
- [x] Property Details Screen
- [x] Image Gallery
- [x] Search & Filters
- [x] Map View
- [x] Save to Favorites

### الأسبوع 5-6: Projects + Services
- [x] Projects List Screen
- [x] Project Card Component
- [x] Project Details Screen
- [x] Services List Screen
- [x] Service Details Screen
- [x] Service Request Form
- [x] Contact Form

### الأسبوع 7-8: Add Property + User Dashboard
- [x] Multi-step Property Form
- [x] Image Picker & Upload
- [x] Location Picker (Map)
- [x] Features Selection
- [x] User Profile Screen
- [x] Edit Profile
- [x] My Properties List
- [x] Property Status (Pending/Approved/Rejected)
- [x] Favorites List

### الأسبوع 9: Push Notifications + Polish
- [x] Firebase Setup
- [x] Push Notifications Implementation
- [x] Notification Handlers
- [x] Deep Linking
- [x] Loading States
- [x] Error Handling
- [x] Empty States
- [x] Skeleton Loaders

### الأسبوع 10: Testing + Deployment
- [x] Unit Tests
- [x] Integration Tests
- [x] Manual Testing
- [x] Bug Fixes
- [x] Performance Optimization
- [x] Build APK/IPA
- [x] Store Submission Preparation
- [x] Documentation

---

## 🚀 الأوامر الأساسية

```bash
# إنشاء المشروع
npx create-expo-app amg-real-estate --template blank-typescript
cd amg-real-estate

# تثبيت الاعتماديات الأساسية
npm install react-native-paper react-native-safe-area-context
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install @tanstack/react-query axios
npm install zustand
npm install react-hook-form zod @hookform/resolvers
npm install react-native-reanimated react-native-gesture-handler
npm install date-fns

# تثبيت Expo Packages
npx expo install expo-image expo-image-picker expo-location expo-notifications
npx expo install expo-secure-store expo-linear-gradient expo-blur
npx expo install react-native-maps

# تشغيل المشروع
npm start

# تشغيل على Android
npm run android

# تشغيل على iOS
npm run ios

# بناء التطبيق
eas build --platform android
eas build --platform ios
```

---

## 📱 متطلبات الأجهزة للتطوير

### للتطوير على Android:
- ✅ Windows/Mac/Linux
- ✅ Android Studio
- ✅ Android Emulator أو جهاز حقيقي
- ✅ Node.js 18+
- ✅ Expo Go App (للتجربة السريعة)

### للتطوير على iOS:
- ⚠️ Mac فقط
- ✅ Xcode 15+
- ✅ iOS Simulator أو iPhone حقيقي
- ✅ Apple Developer Account ($99/year)

### البديل: Expo Development Build
- ✅ يشتغل على أي نظام
- ✅ بدون Android Studio أو Xcode
- ✅ Build على السحابة (EAS Build)
- ✅ OTA Updates بدون Store

---

## 🎓 مصادر التعلم

### الرسمية:
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Query](https://tanstack.com/query)

### YouTube Channels:
- **Code with Ania Kubów** - React Native Tutorials
- **Programming with Mosh** - React Native Course
- **Traversy Media** - React Native Crash Course
- **The Net Ninja** - React Native Tutorial Series

### عربي:
- **كودزيلا** - دورات React Native بالعربي
- **محمد عيسى** - شروحات React Native
- **Hassouna Academy** - React Native بالعربي

---

## ✅ Checklist النهائي

### Setup (أول يوم)
- [ ] تثبيت Node.js و npm
- [ ] تثبيت Expo CLI
- [ ] إنشاء المشروع
- [ ] Setup Git Repository
- [ ] تثبيت المكتبات الأساسية
- [ ] Setup Theme System
- [ ] Setup Navigation

### Authentication
- [ ] Login Screen
- [ ] Register Screen
- [ ] Forgot Password
- [ ] JWT Token Management
- [ ] SecureStore Integration
- [ ] Biometric Auth

### Home & Properties
- [ ] Home Screen Design
- [ ] Properties List
- [ ] Property Card
- [ ] Property Details
- [ ] Search & Filters
- [ ] Map View
- [ ] Favorites

### Projects & Services
- [ ] Projects List
- [ ] Project Details
- [ ] Services List
- [ ] Service Details
- [ ] Service Request Form

### Add Property
- [ ] Multi-step Form
- [ ] Image Picker
- [ ] Location Picker
- [ ] Validation
- [ ] API Integration

### User Dashboard
- [ ] Profile Screen
- [ ] Edit Profile
- [ ] My Properties
- [ ] Notifications

### Polish
- [ ] Loading States
- [ ] Error Handling
- [ ] Empty States
- [ ] Animations
- [ ] RTL Support
- [ ] Dark Mode
- [ ] i18n (Arabic/English)

### Testing
- [ ] Unit Tests
- [ ] Integration Tests
- [ ] Manual Testing
- [ ] Performance Testing

### Deployment
- [ ] Build APK
- [ ] Build IPA
- [ ] Store Listing
- [ ] Screenshots
- [ ] App Description
- [ ] Submit to Stores

---

## 🎯 النتيجة المتوقعة

بعد اتباع هذا الدليل، ستحصل على:

✅ **تطبيق موبايل احترافي** لـ AMG Real Estate  
✅ **يعمل على iOS و Android** بنفس الكود  
✅ **تصميم عصري وجذاب** يليق بالشركة  
✅ **أداء ممتاز** 60 FPS سلس  
✅ **تجربة مستخدم رائعة** UX محترف  
✅ **متكامل مع الموقع** نفس الـ Backend  
✅ **إشعارات فورية** Push Notifications  
✅ **دعم العربية والإنجليزية** RTL/LTR  
✅ **Dark Mode** وضع ليلي  
✅ **Offline Mode** بعض المميزات بدون نت  

---

**التطبيق جاهز للمنافسة مع أفضل تطبيقات العقارات في السوق! 🚀💎**

**وقت التطوير المتوقع: 10-12 أسبوع**  
**التكلفة: أقل من Native بـ 60%**  
**جودة التصميم: World-Class ✨**
