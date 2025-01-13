import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const supabase = createClient(
    config.public.supabaseUrl,           // URL ที่เป็น public
    config.supabaseServiceRoleKey        // Service Role (Key ลับ)
  );

  // ตัวอย่างการ query
  const { data, error } = await supabase
    .from('my_table')
    .select('*');

  if (error) {
    // throw error หรือส่งกลับ error
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    });
  }

  return data;
});
