import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = cookies();
  
  // Remover o cookie de sessão
  await cookieStore.delete('user');
  
  return NextResponse.json(
    { success: true, message: 'Logout realizado com sucesso' },
    { status: 200 }
  );
} 