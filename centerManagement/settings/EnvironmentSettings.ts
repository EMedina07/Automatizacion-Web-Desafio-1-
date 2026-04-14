interface EnvironmentSettings {
  env: string;
  baseURL: string;
}

const enviroments: Record<string, EnvironmentSettings> = {
  qa:  { 
    env: 'qa',
    baseURL: 'https://web.elaniin.dev/'
  },
  cert:{ 
    env: '',
    baseURL: ''
  }
};

export default enviroments[process.env.ENV || 'qa'];