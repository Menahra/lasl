import type { FastifyBaseLogger } from 'fastify';
import { Resend, type CreateEmailOptions } from 'resend';

// move to doppler
const resend = new Resend('re_29y76kd1_N4PGKMVoWDzrNkuMyFQLuT64');

export const sendMail = async (mailOptions: CreateEmailOptions, logger: FastifyBaseLogger) => {
    const { data, error } = await resend.emails.send({
        ...mailOptions,
        from: 'onboarding@resend.dev',
    });

    if (error) {
        logger.error({ error }, `failed to send email with subject ${mailOptions.subject}`);
        return { success: false, error };
    }
    
    logger.info({ data }, 'Email sent successfully');
    return { success: true, data };
};
