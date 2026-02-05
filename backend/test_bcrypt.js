import bcrypt from 'bcryptjs';

const test = async () => {
    const pass = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, salt);
    console.log('Plain:', pass);
    console.log('Hash:', hash);

    const isMatch = await bcrypt.compare(pass, hash);
    console.log('Match result:', isMatch);

    const isFalseMatch = await bcrypt.compare('wrong', hash);
    console.log('False match result:', isFalseMatch);
};

test();
