import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Login } from './Login';
import { signIn } from 'next-auth/react';

// NextAuthのsignIn関数をモックにする
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

// useRouterをモックにする
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe('Loginコンポーネントのテスト', () => {
  it('パスワードが間違っている場合、エラーメッセージが表示されること', async () => {
    // 1. signIn関数が「パスワード不一致」のエラーを返すように設定
    (signIn as any).mockResolvedValue({
      error: 'パスワードが一致しません。',
      ok: false,
    });

    render(<Login />);

    // 2. 入力欄に値を入力
    fireEvent.change(screen.getByTestId('input-username'), { target: { value: 'yamada' } });
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'wrong-password' } });

    // 3. 送信ボタンをクリック
    fireEvent.click(screen.getByTestId('submit-button'));

    // 4. 検証：指定したエラーメッセージが画面に出ているか
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('パスワードが一致しません。');
    });
  });

  it('必須項目が未入力の場合、ボタンが非活性(クリック不可)であること', () => {
    render(<Login />);
    const submitButton = screen.getByTestId('submit-button');
    // usernameとpasswordが空なので、disabled属性がついている
    expect(submitButton).toBeDisabled();
  });
});