// import { createClient } from "@supabase/supabase-js";

// export default defineNuxtPlugin((nuxtApp) => {
//   const config = useRuntimeConfig();

//   const supabase = createClient(
//     config.public.supabaseUrl,
//     config.public.supabaseAnonKey
//   );

//   // ส่งต่อให้ component อื่น ๆ เรียกใช้ผ่าน useNuxtApp().$supabase
//   return {
//     provide: {
//       supabase,
//     },
//   };
// });
