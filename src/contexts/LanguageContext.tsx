
import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.rooms': 'Rooms',
    'nav.facilities': 'Facilities',
    'nav.gallery': 'Gallery',
    'nav.booking': 'Booking',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'nav.bookNow': 'BOOK NOW',
    
    // Booking Form
    'booking.title': 'Book',
    'booking.guestInfo': 'Guest Information',
    'booking.fullName': 'Full Name',
    'booking.email': 'Email Address',
    'booking.phone': 'Phone Number',
    'booking.bookingDetails': 'Booking Details',
    'booking.checkIn': 'Check-in Date',
    'booking.checkOut': 'Check-out Date',
    'booking.guests': 'Number of Guests',
    'booking.summary': 'Booking Summary',
    'booking.roomType': 'Room Type',
    'booking.nights': 'Nights',
    'booking.ratePerNight': 'Rate per night',
    'booking.total': 'Total',
    'booking.cancel': 'Cancel',
    'booking.submit': 'Submit Booking Request',
    'booking.submitting': 'Submitting...',
    'booking.success': 'Booking Request Submitted',
    'booking.successDesc': 'Your booking request has been submitted successfully. You\'ll receive an email confirmation once it\'s reviewed.',
    'booking.error': 'Error',
    'booking.errorDesc': 'Failed to submit booking request. Please try again.',
    
    // Room Details
    'room.available': 'Available',
    'room.notAvailable': 'Not Available',
    'room.features': 'Room Features',
    'room.backToRooms': 'Back to Rooms',
    'room.notFound': 'Room Not Found',
    'room.notFoundDesc': 'The room you\'re looking for doesn\'t exist.',
    'room.backToHome': 'Back to Home',
    'room.guarantee': 'Best rate guaranteed • Free cancellation',
    
    // Invoice
    'invoice.title': 'Booking Invoice',
    'invoice.download': 'Download Invoice',
    'invoice.invoiceNumber': 'Invoice Number',
    'invoice.bookingId': 'Booking ID',
    'invoice.guestDetails': 'Guest Details',
    'invoice.bookingDetails': 'Booking Details',
    'invoice.paymentSummary': 'Payment Summary',
    'invoice.subtotal': 'Subtotal',
    'invoice.taxes': 'Taxes (10%)',
    'invoice.grandTotal': 'Grand Total',
    'invoice.status': 'Status',
    'invoice.date': 'Date',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.rooms': 'الغرف',
    'nav.facilities': 'المرافق',
    'nav.gallery': 'المعرض',
    'nav.booking': 'الحجز',
    'nav.contact': 'اتصل بنا',
    'nav.admin': 'الإدارة',
    'nav.bookNow': 'احجز الآن',
    
    // Booking Form
    'booking.title': 'حجز',
    'booking.guestInfo': 'معلومات النزيل',
    'booking.fullName': 'الاسم الكامل',
    'booking.email': 'البريد الإلكتروني',
    'booking.phone': 'رقم الهاتف',
    'booking.bookingDetails': 'تفاصيل الحجز',
    'booking.checkIn': 'تاريخ الوصول',
    'booking.checkOut': 'تاريخ المغادرة',
    'booking.guests': 'عدد النزلاء',
    'booking.summary': 'ملخص الحجز',
    'booking.roomType': 'نوع الغرفة',
    'booking.nights': 'الليالي',
    'booking.ratePerNight': 'السعر لكل ليلة',
    'booking.total': 'الإجمالي',
    'booking.cancel': 'إلغاء',
    'booking.submit': 'إرسال طلب الحجز',
    'booking.submitting': 'جاري الإرسال...',
    'booking.success': 'تم إرسال طلب الحجز',
    'booking.successDesc': 'تم إرسال طلب الحجز بنجاح. ستتلقى رسالة تأكيد بالبريد الإلكتروني بمجرد مراجعته.',
    'booking.error': 'خطأ',
    'booking.errorDesc': 'فشل في إرسال طلب الحجز. يرجى المحاولة مرة أخرى.',
    
    // Room Details
    'room.available': 'متوفر',
    'room.notAvailable': 'غير متوفر',
    'room.features': 'مميزات الغرفة',
    'room.backToRooms': 'العودة إلى الغرف',
    'room.notFound': 'الغرفة غير موجودة',
    'room.notFoundDesc': 'الغرفة التي تبحث عنها غير موجودة.',
    'room.backToHome': 'العودة إلى الرئيسية',
    'room.guarantee': 'أفضل سعر مضمون • إلغاء مجاني',
    
    // Invoice
    'invoice.title': 'فاتورة الحجز',
    'invoice.download': 'تحميل الفاتورة',
    'invoice.invoiceNumber': 'رقم الفاتورة',
    'invoice.bookingId': 'رقم الحجز',
    'invoice.guestDetails': 'تفاصيل النزيل',
    'invoice.bookingDetails': 'تفاصيل الحجز',
    'invoice.paymentSummary': 'ملخص الدفع',
    'invoice.subtotal': 'المجموع الفرعي',
    'invoice.taxes': 'الضرائب (10%)',
    'invoice.grandTotal': 'الإجمالي الكلي',
    'invoice.status': 'الحالة',
    'invoice.date': 'التاريخ',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const isRTL = language === 'ar';

  // Apply RTL styling to document
  React.useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [isRTL, language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};
