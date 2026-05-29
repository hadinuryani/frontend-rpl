const I = ({ children, size = 24, color = 'currentColor', className = '', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>{children}</svg>
);

export const IconHome = (p) => <I {...p}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/></I>;

export const IconClipboard = (p) => <I {...p}><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></I>;

export const IconFolder = (p) => <I {...p}><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></I>;

export const IconPill = (p) => <I {...p}><path d="M10.5 1.5l-8 8a4.95 4.95 0 007 7l8-8a4.95 4.95 0 00-7-7z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/></I>;

export const IconBell = (p) => <I {...p}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></I>;

export const IconSettings = (p) => <I {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></I>;

export const IconLogout = (p) => <I {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></I>;

export const IconQueue = (p) => <I {...p}><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/><line x1="12" y1="15" x2="12" y2="17"/></I>;

export const IconCalendar = (p) => <I {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></I>;

export const IconChart = (p) => <I {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></I>;

export const IconUsers = (p) => <I {...p}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></I>;

export const IconPackage = (p) => <I {...p}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></I>;

export const IconPregnant = (p) => <I {...p}><circle cx="12" cy="5" r="3"/><path d="M12 8c-2.5 0-4 2-4 4.5 0 1.5.5 3 1.5 4.5l1 1.5c.3.5.8.5 1 .5h1c.2 0 .7 0 1-.5l1-1.5c1-1.5 1.5-3 1.5-4.5 0-2.5-1.5-4.5-4-4.5z"/><path d="M10 21h4"/></I>;

export const IconBaby = (p) => <I {...p}><circle cx="12" cy="10" r="6"/><path d="M12 4C9 4 7 5 7 5"/><path d="M12 4c3 0 5 1 5 1"/><circle cx="10" cy="10" r="0.5" fill="currentColor" stroke="none"/><circle cx="14" cy="10" r="0.5" fill="currentColor" stroke="none"/><path d="M10 13c.8.8 3.2.8 4 0"/><path d="M8 16l-1 5"/><path d="M16 16l1 5"/></I>;

export const IconSyringe = (p) => <I {...p}><path d="M18 2l4 4-9.5 9.5-4-4z"/><path d="M8.5 15.5L2 22"/><line x1="15" y1="6" x2="18.5" y2="9.5"/><line x1="10" y1="11" x2="13.5" y2="7.5"/></I>;

export const IconBottle = (p) => <I {...p}><path d="M8 2h8v3H8z"/><path d="M7 5h10l1 3v12a2 2 0 01-2 2H8a2 2 0 01-2-2V8l1-3z"/><line x1="6" y1="14" x2="18" y2="14"/></I>;

export const IconStethoscope = (p) => <I {...p}><path d="M4.8 2.3A2 2 0 003 4v3a5 5 0 005 5 5 5 0 005-5V4a2 2 0 00-1.8-1.7"/><path d="M8 12v3a4 4 0 004 4h1a3 3 0 003-3v-1"/><circle cx="16" cy="14" r="1.5"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/></I>;

export const IconHospital = (p) => <I {...p}><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M3 7l9-5 9 5"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></I>;

export const IconDoctor = (p) => <I {...p}><circle cx="12" cy="7" r="4"/><path d="M5.5 21v-2a6.5 6.5 0 0113 0v2"/><path d="M12 11v2"/><circle cx="12" cy="15" r="1"/></I>;

export const IconMail = (p) => <I {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></I>;

export const IconLock = (p) => <I {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></I>;

export const IconEye = (p) => <I {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></I>;

export const IconEyeOff = (p) => <I {...p}><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/><path d="M14.12 14.12a3 3 0 01-4.24-4.24"/></I>;

export const IconLeaf = (p) => <I {...p}><path d="M11 20A7 7 0 019.8 6.9C15.5 4.9 20 2 20 2s-1.1 5.2-3 10.3A7 7 0 0111 20z"/><path d="M4 22l6-6"/></I>;

export const IconFlower = (p) => <I {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2a4 4 0 014 4c0 1.95-2 4-4 6-2-2-4-4.05-4-6a4 4 0 014-4z"/><path d="M22 12a4 4 0 01-4 4c-1.95 0-4-2-6-4 2-2 4.05-4 6-4a4 4 0 014 4z"/><path d="M12 22a4 4 0 01-4-4c0-1.95 2-4 4-6 2 2 4 4.05 4 6a4 4 0 01-4 4z"/><path d="M2 12a4 4 0 014-4c1.95 0 4 2 6 4-2 2-4.05 4-6 4a4 4 0 01-4-4z"/></I>;

export const IconMessageCircle = (p) => <I {...p}><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></I>;

export const IconCheck = (p) => <I {...p}><polyline points="20 6 9 17 4 12"/></I>;

export const IconCheckCircle = (p) => <I {...p}><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></I>;

export const IconFileText = (p) => <I {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></I>;

export const IconTrash = (p) => <I {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></I>;

export const IconX = (p) => <I {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></I>;

export const IconAlertTriangle = (p) => <I {...p}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></I>;

export const IconClock = (p) => <I {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></I>;

export const IconUser = (p) => <I {...p}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></I>;

export const IconTrendingUp = (p) => <I {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></I>;

export const IconSearch = (p) => <I {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></I>;

export const IconPlus = (p) => <I {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></I>;

export const IconArrowLeft = (p) => <I {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></I>;

export const IconArrowRight = (p) => <I {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></I>;

export const IconChevronRight = (p) => <I {...p}><polyline points="9 18 15 12 9 6"/></I>;

export const IconHeart = (p) => <I {...p}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></I>;

export const IconShield = (p) => <I {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></I>;

export const IconAward = (p) => <I {...p}><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></I>;

export const IconMapPin = (p) => <I {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></I>;

export const IconPhone = (p) => <I {...p}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></I>;

export const IconWhatsApp = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="currentColor" className={p.className||''}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export const IconFemale = (p) => <I {...p}><circle cx="12" cy="8" r="5"/><line x1="12" y1="13" x2="12" y2="21"/><line x1="9" y1="18" x2="15" y2="18"/></I>;

export const IconMale = (p) => <I {...p}><circle cx="10" cy="14" r="5"/><line x1="19" y1="5" x2="13.6" y2="10.4"/><polyline points="19 5 19 10"/><polyline points="19 5 14 5"/></I>;

export const IconRefresh = (p) => <I {...p}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></I>;

export const IconEdit = (p) => <I {...p}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></I>;

export const IconMinus = (p) => <I {...p}><line x1="5" y1="12" x2="19" y2="12"/></I>;

export const IconStar = (p) => <I {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></I>;

export const IconActivity = (p) => <I {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></I>;

export const IconKey = (p) => <I {...p}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5l-2.5-2.5"/></I>;

export const IconMenuFold = (p) => <I {...p}><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="18" y2="18"/><polyline points="15 8 11 12 15 16"/></I>;

export const IconMenuUnfold = (p) => <I {...p}><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="18" y2="18"/><polyline points="12 8 16 12 12 16"/></I>;

export const IconInfo = (p) => <I {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></I>;


