type configType = {
  AUTHENTICATION_SECRET_KEY: string;
  AWS_SECRET_ACCESS: string;
  AWS_ACCESS_KEY: string;
  MLAB_URI: string;
  PORT: 5002;
};

const config: configType = {
  AUTHENTICATION_SECRET_KEY: process.env.AUTHENTICATION_SECRET_KEY!,
  AWS_SECRET_ACCESS: process.env.AWS_SECRET_ACCESS!,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY!,
  MLAB_URI: process.env.MLAB_URI!,
  PORT: 5002,
};

export default config;
