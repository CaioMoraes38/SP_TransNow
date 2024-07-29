import axios from 'axios';

const baseUrl = 'http://api.olhovivo.sptrans.com.br/v2.1';
const token = 'ae95af7762d60be9d8505b393cada116b3bb51e5e2af43342ac28fe935ca5845';

interface Linha {
  cl: number;
  lt: string;
  tp: string;
}

interface Parada {
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
}

interface Previsao {
  linha: string;
  sentido: string;
  chegada: string;
}

let isAuthenticated = false;

export const authenticate = async (): Promise<boolean> => {
  if (isAuthenticated) {
    return true;
  }

  try {
    const response = await axios.post(`${baseUrl}/Login/Autenticar?token=${token}`);
    isAuthenticated = response.data !== null;
    return isAuthenticated;
  } catch (error) {
    console.error('Erro ao autenticar:', error);
    return false;
  }
};

export const getLinhas = async (termosBusca: string): Promise<Linha[]> => {
  try {
    const auth = await authenticate();
    if (!auth) {
      throw new Error('Falha na autenticação');
    }

    const response = await axios.get<Linha[]>(`${baseUrl}/Linha/Buscar`, {
      params: { termosBusca },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!Array.isArray(response.data)) {
      console.error('Formato de resposta inesperado:', response.data);
      return [];
    }

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar linhas:', error.response?.status, error.message);
    return [];
  }
};

export const getParadas = async (termosBusca: string): Promise<Parada[]> => {
  try {
    const auth = await authenticate();
    if (!auth) {
      throw new Error('Falha na autenticação');
    }

    const response = await axios.get<Parada[]>(`${baseUrl}/Parada/Buscar`, {
      params: { termosBusca },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!Array.isArray(response.data)) {
      console.error('Formato de resposta inesperado:', response.data);
      return [];
    }

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar paradas:', error.response?.status, error.message);
    return [];
  }
};

export const getLinhasPorParada = async (codigoParada: number): Promise<Linha[]> => {
  try {
    const auth = await authenticate();
    if (!auth) {
      throw new Error('Falha na autenticação');
    }

    const response = await axios.get<Linha[]>(`${baseUrl}/Parada/BuscarLinhasPorParada`, {
      params: { codigoParada },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!Array.isArray(response.data)) {
      console.error('Formato de resposta inesperado:', response.data);
      return [];
    }

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar linhas por parada:', error.response?.status, error.message);
    return [];
  }
};

export const getVeiculos = async (codigoLinha: number) => {
  try {
    const auth = await authenticate();
    if (!auth) {
      throw new Error('Falha na autenticação');
    }

    const response = await axios.get(`${baseUrl}/Posicao/Linha`, {
      params: { codigoLinha },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const veiculos = response.data.vs || [];
    if (!Array.isArray(veiculos)) {
      console.error('Formato de resposta inesperado:', veiculos);
      return [];
    }

    return veiculos;
  } catch (error) {
    console.error('Erro ao buscar veículos:', error.response?.status, error.message);
    return [];
  }
};

export const getPrevisaoChegada = async (codigoParada: number, codigoLinha: number): Promise<Previsao[]> => {
  try {
    const auth = await authenticate();
    if (!auth) {
      throw new Error('Falha na autenticação');
    }

    const response = await axios.get(`${baseUrl}/Previsao`, {
      params: { codigoParada, codigoLinha },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const previsoes = response.data;
    if (!Array.isArray(previsoes)) {
      console.error('Formato de resposta inesperado:', previsoes);
      return [];
    }

    return previsoes;
  } catch (error) {
    console.error('Erro ao buscar previsões de chegada:', error.response?.status, error.message);
    return [];
  }
};
