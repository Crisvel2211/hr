import jwt from 'jsonwebtoken';

const generateServiceToken = () => {
    const payload = { service: 'Hr 2' };
    return jwt.sign(payload, process.env.GATEWAY_JWT_SECRET, { expiresIn: '10m' });
};

export { generateServiceToken };