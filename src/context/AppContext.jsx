import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

const initialSettings = {
    waNumber: '62895379178780',
    businessName: 'Norma Rias',
    address: 'Jln Mbah Buka RT 04 / RW 01, Kabukan Tengah, Kec. Tarub, Kab. Tegal',
    instagram: '@normarias_makeup'
};

export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [services, setServices] = useState([]);
    const [classes, setClasses] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [orders, setOrders] = useState([]);
    const [settings, setSettings] = useState(initialSettings);
    const [loading, setLoading] = useState(true);

    // ── 1. SYNC AUTH SUPABASE ──
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    // ── 2. FETCH DATA SUPABASE ──
    const fetchServices = async () => {
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;

            const formatted = (data || []).map(item => ({
                id: item.id,
                name: item.nama_layanan || item.nama || item.name || 'Layanan Tanpa Nama',
                price: item.harga || item.price || 0,
                description: item.deskripsi || item.description || '',
                category: item.kategori || item.category || 'Umum',
                image: item.gambar || item.image || 'https://placehold.co/400x240/0c1020/d4a843?text=Layanan'
            }));

            setServices(formatted);
        } catch (err) {
            console.error('Gagal mengambil data layanan:', err.message);
        }
    };

    const fetchClasses = async () => {
        try {
            const { data, error } = await supabase
                .from('classes')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;

            const formatted = (data || []).map(cls => ({
                id: cls.id,
                name: cls.name_kelas || cls.nama_kelas || cls.name || 'Kelas Tanpa Nama',
                price: cls.price || cls.harga || 0,
                duration: cls.duration || cls.durasi || '',
                schedule: cls.schedule || cls.jadwal || '',
                quota: cls.quota || cls.kuota || 0,
                description: cls.description || cls.deskripsi || '',
                image: cls.image || cls.gambar || 'https://placehold.co/400x240/0c1020/d4a843?text=Kelas',
                level: cls.level || 'Pemula',
                includes: cls.includes || cls.fasilitas || ''
            }));

            setClasses(formatted);
        } catch (err) {
            console.error('Gagal mengambil data kelas:', err.message);
        }
    };

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .order('id', { ascending: false });

            if (error) throw error;

            const formatted = (data || []).map(item => ({
                id: item.id,
                name: item.nama || item.name || 'Anonim',
                service: item.role || item.service || item.layanan || 'Pelanggan',
                comment: item.comment || item.komentar || item.ulasan || '',
                rating: item.rating || 5
            }));

            setReviews(formatted);
        } catch (err) {
            console.error('Gagal mengambil data ulasan:', err.message);
        }
    };

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('id', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (err) {
            console.error('Gagal mengambil data pesanan:', err.message);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            await Promise.all([fetchServices(), fetchClasses(), fetchReviews(), fetchOrders()]);
            setLoading(false);
        };
        loadInitialData();
    }, []);

    // ── 3. CRUD LAYANAN (SERVICES) ──
    const addService = async (newService) => {
        try {
            const { error } = await supabase.from('services').insert([{
                nama_layanan: newService.name,
                harga: newService.price,
                deskripsi: newService.description,
                kategori: newService.category,
                gambar: newService.image
            }]);
            if (error) throw error;
            await fetchServices();
            return { success: true };
        } catch (err) {
            console.error('Gagal menambah layanan:', err.message);
            return { success: false, error: err.message };
        }
    };

    const updateService = async (id, updatedService) => {
        try {
            const { error } = await supabase
                .from('services')
                .update({
                    nama_layanan: updatedService.name,
                    harga: updatedService.price,
                    deskripsi: updatedService.description,
                    kategori: updatedService.category,
                    gambar: updatedService.image
                })
                .eq('id', id);
            if (error) throw error;
            await fetchServices();
            return { success: true };
        } catch (err) {
            console.error('Gagal memperbarui layanan:', err.message);
            return { success: false, error: err.message };
        }
    };

    const deleteService = async (id) => {
        try {
            const { error } = await supabase.from('services').delete().eq('id', id);
            if (error) throw error;
            await fetchServices();
            return { success: true };
        } catch (err) {
            console.error('Gagal menghapus layanan:', err.message);
            return { success: false, error: err.message };
        }
    };

    // ── 4. CRUD KELAS (CLASSES) ──
    const addClass = async (newClass) => {
        try {
            const { error } = await supabase.from('classes').insert([{
                name_kelas: newClass.name || newClass.nama_kelas,
                price: newClass.price || newClass.harga,
                duration: newClass.duration || newClass.durasi,
                schedule: newClass.schedule || newClass.jadwal,
                quota: newClass.quota || newClass.kuota,
                description: newClass.description || newClass.deskripsi,
                image: newClass.image || newClass.gambar,
                level: newClass.level || 'pemula',
                includes: newClass.includes || newClass.fasilitas
            }]);
            if (error) throw error;
            await fetchClasses();
            return { success: true };
        } catch (err) {
            console.error('Gagal menambah kelas:', err.message);
            return { success: false, error: err.message };
        }
    };

    const updateClass = async (id, updatedClass) => {
        try {
            const { error } = await supabase
                .from('classes')
                .update({
                    name_kelas: updatedClass.name || updatedClass.nama_kelas,
                    price: updatedClass.price || updatedClass.harga,
                    duration: updatedClass.duration || updatedClass.durasi,
                    schedule: updatedClass.schedule || updatedClass.jadwal,
                    quota: updatedClass.quota || updatedClass.kuota,
                    description: updatedClass.description || updatedClass.deskripsi,
                    image: updatedClass.image || updatedClass.gambar,
                    level: updatedClass.level || 'pemula',
                    includes: updatedClass.includes || updatedClass.fasilitas
                })
                .eq('id', id);
            if (error) throw error;
            await fetchClasses();
            return { success: true };
        } catch (err) {
            console.error('Gagal memperbarui kelas:', err.message);
            return { success: false, error: err.message };
        }
    };

    const deleteClass = async (id) => {
        try {
            const { error } = await supabase.from('classes').delete().eq('id', id);
            if (error) throw error;
            await fetchClasses();
            return { success: true };
        } catch (err) {
            console.error('Gagal menghapus kelas:', err.message);
            return { success: false, error: err.message };
        }
    };

    // ── 5. CRUD ULASAN (REVIEWS) ──
    const addReview = async (newReview) => {
        try {
            const { error } = await supabase.from('reviews').insert([{
                nama: newReview.name,
                role: newReview.service || 'Pelanggan',
                comment: newReview.comment,
                rating: Number(newReview.rating) || 5
            }]);

            if (error) throw error;

            await fetchReviews();
            return { success: true };
        } catch (err) {
            console.error('Gagal menambah ulasan:', err.message);
            return { success: false, error: err.message };
        }
    };

    // ── 6. CRUD PESANAN (ORDERS) ──
    const addOrder = async (newOrder) => {
        try {
            const { error } = await supabase.from('orders').insert([{
                nama: newOrder.name || newOrder.nama,
                email: newOrder.email,
                phone: newOrder.phone,
                service: newOrder.service || newOrder.layanan,
                date: newOrder.date || newOrder.tanggal_acara,
                status: 'pending'
            }]);

            if (error) {
                console.error('Error dari Supabase:', error.message);
                throw error;
            }

            await fetchOrders();
            return { success: true };
        } catch (err) {
            console.error('Gagal menyimpan pesanan:', err.message);
            return { success: false, error: err.message };
        }
    };

    // ── 7. UTILITY FUNCTIONS ──
    const sendWhatsApp = (formData) => {
        const phone = settings?.waNumber || '62895379178780';
        const message =
            `Halo Norma Rias, saya ingin memesan layanan:\n\n` +
            `*Nama:* ${formData.name}\n` +
            `*Email:* ${formData.email || '-'}\n` +
            `*No. HP:* ${formData.phone}\n` +
            `*Layanan:* ${formData.service}\n` +
            `*Tanggal Acara:* ${formData.date || '-'}\n` +
            `*Pesan Tambahan:* ${formData.message || '-'}`;

        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const sendClassWhatsApp = (selectedClass, formData) => {
        const phone = settings?.waNumber || '62895379178780';
        const message = `Halo, saya ingin mendaftar kelas makeup:\n\n*Kelas:* ${selectedClass?.name}\n*Nama:* ${formData.name}\n*No. HP:* ${formData.phone}\n*Email:* ${formData.email || '-'}`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <AppContext.Provider value={{ 
            user,
            isAdmin: !!user,
            loading,
            logout,
            services: services || [], 
            classes: classes || [], 
            reviews: reviews || [], 
            orders: orders || [],
            settings: settings || initialSettings, 
            addService, 
            updateService, 
            deleteService,
            addClass,
            updateClass,
            deleteClass,
            addReview,
            addOrder,
            sendWhatsApp,
            sendClassWhatsApp,
            setSettings
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);