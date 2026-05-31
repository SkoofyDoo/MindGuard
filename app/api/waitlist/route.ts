import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const timestamp = new Date().toISOString();

  try {
    const body = await request.json();
    const { price, feedback, joinWaitlist, email, name } = body;

    const targetEmail = process.env.WAITLIST_EMAIL || 'alekskvest@mail.de';

    const logData = {
      price,
      feedback: feedback || '(пусто)',
      joinWaitlist: !!joinWaitlist,
      name: name || '(не указано)',
      email: email || '(не указано)',
      timestamp,
    };

    console.log('=== NEW SELF-PRICING / WAITLIST SUBMISSION ===');
    console.log('Target email:', targetEmail);
    console.log(logData);

    const emailContent = `
      <h2>Новый Self-Pricing Feedback от MindGuard</h2>
      <p><strong>Дата (UTC):</strong> ${timestamp}</p>
      
      <h3>Выбранный ценник:</h3>
      <p><strong>${price}</strong></p>

      <h3>Фидбек:</h3>
      <p>${feedback || '— (не указан)'}</p>

      <h3>Waitlist:</h3>
      <p>${joinWaitlist ? '✅ Пользователь подписался на Waitlist' : '❌ Не подписался'}</p>

      ${name ? `<p><strong>Имя:</strong> ${name}</p>` : ''}
      ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}

      <hr />
      <p><small>Это сообщение автоматически отправлено с лендинга MindGuard.</small></p>
    `;

    console.log(`[Waitlist] Attempting to send email to: ${targetEmail}`);

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const { data, error } = await resend.emails.send({
        from: 'MindGuard <onboarding@resend.dev>',
        to: targetEmail,
        subject: `MindGuard Self-Pricing: ${price}`,
        html: emailContent,
      });

      if (error) {
        console.error('Resend error:', error);
        // Всё равно возвращаем успех пользователю, но логируем проблему
        return NextResponse.json({ 
          success: true, 
          message: joinWaitlist 
            ? 'Спасибо! Данные приняты. Вы добавлены в Waitlist (скидка 50%). Письмо может прийти с небольшой задержкой.' 
            : 'Спасибо за фидбек! Данные приняты.' 
        });
      }

      console.log('Email sent via Resend. ID:', data?.id);
    } else {
      console.warn('RESEND_API_KEY not found. Email not sent, only logged.');
    }

    return NextResponse.json({ 
      success: true, 
      message: joinWaitlist 
        ? 'Спасибо! Вы добавлены в Waitlist и получаете пожизненную скидку 50%.' 
        : 'Спасибо за фидбек!' 
    });

  } catch (error: any) {
    console.error('Waitlist form error:', error);
    return NextResponse.json(
      { success: false, message: 'Произошла ошибка при отправке. Попробуйте позже.' }, 
      { status: 500 }
    );
  }
}
