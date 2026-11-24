/**
 * ÉLAN BEAUTY STUDIO • SUPABASE LIVE CLIENT ENGINE
 * Handles Live Bookings, Consultations & Fallbacks
 * Project: aurum-saffron-001 (quslrmacqonpxucolgil)
 */

const SUPABASE_CONFIG = {
  url: 'https://quslrmacqonpxucolgil.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1c2xybWFjcW9ucHh1Y29sZ2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU0MTI0NTcsImV4cCI6MjExMDk4ODQ1N30.1zcaafbKNErzpIpnnhQZyWjWyJivTSQtxsFQNOSbVdo'
};

let supabaseClient = null;

if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log('✓ ÉLAN Beauty Studio Supabase Client initialized successfully.');
  } catch (err) {
    console.warn('Supabase initialization notice:', err);
  }
}

/**
 * Submit an Appointment booking to Supabase
 */
async function submitBeautyAppointment(data) {
  const refCode = `ELAN-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;

  const payload = {
    reference_code: refCode,
    client_name: data.client_name || 'Valued Guest',
    client_phone: data.client_phone || '',
    client_email: data.client_email || '',
    service_category: data.service_category || 'Haute Beauté & Skincare',
    service_name: data.service_name || 'Signature Treatment',
    stylist_preference: data.stylist_preference || 'First Available Master Artist',
    appointment_date: data.appointment_date || new Date().toISOString().split('T')[0],
    appointment_time: data.appointment_time || '11:00:00',
    special_requests: data.special_requests || '',
    status: 'confirmed'
  };

  if (supabaseClient) {
    try {
      const { data: inserted, error } = await supabaseClient
        .from('beauty_appointments')
        .insert([payload])
        .select();

      if (error) {
        console.warn('Supabase appointment insert notice (falling back locally):', error.message);
      } else {
        console.log('✓ Appointment stored in Supabase:', inserted);
      }
    } catch (e) {
      console.warn('Network notice during Supabase insert:', e);
    }
  }

  // Also save in localStorage as resilient offline record
  try {
    const existing = JSON.parse(localStorage.getItem('elan_appointments') || '[]');
    existing.unshift({ ...payload, submitted_at: new Date().toISOString() });
    localStorage.setItem('elan_appointments', JSON.stringify(existing));
  } catch (e) {}

  return { success: true, refCode, payload };
}

/**
 * Submit a Botanical Elixir / Skincare Consultation to Supabase
 */
async function submitElixirConsultation(data) {
  const refCode = `BOTANIC-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;

  const payload = {
    reference_code: refCode,
    client_name: data.client_name || 'Guest Client',
    client_phone: data.client_phone || '',
    client_email: data.client_email || '',
    skin_type: data.skin_type || 'Dry / Dehydrated',
    concerns: data.concerns || 'Cellular Radiance & Barrier Restoration',
    recommended_elixir: data.recommended_elixir || 'Rose Gold Radiance Elixir',
    status: 'pending'
  };

  if (supabaseClient) {
    try {
      const { data: inserted, error } = await supabaseClient
        .from('beauty_consultations')
        .insert([payload])
        .select();

      if (error) {
        console.warn('Supabase consultation insert notice:', error.message);
      } else {
        console.log('✓ Consultation stored in Supabase:', inserted);
      }
    } catch (e) {
      console.warn('Network notice during Supabase insert:', e);
    }
  }

  return { success: true, refCode, payload };
}

window.submitBeautyAppointment = submitBeautyAppointment;
window.submitElixirConsultation = submitElixirConsultation;
window.getSupabaseClient = () => supabaseClient;
