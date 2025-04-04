import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import usersData from '@/data/users.json';

// Importando usuários do arquivo JSON
const USERS = usersData.users;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    // Verificar se o usuário existe
    if (!USERS[username]) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 401 }
      );
    }

    // Verificar se a senha está correta
    if (USERS[username].password !== password) {
      return NextResponse.json(
        { error: 'Senha incorreta' },
        { status: 401 }
      );
    }

    // Autenticação bem-sucedida
    const cookieStore = cookies();
    
    // Configurar cookie de sessão (em produção, você usaria JWT ou outra solução segura)
    await cookieStore.set('user', JSON.stringify({
      username,
      isAdmin: USERS[username].isAdmin,
      loggedIn: true
    }), {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    // Redirecionar para a página principal
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro no processamento do login' },
      { status: 500 }
    );
  }
} 