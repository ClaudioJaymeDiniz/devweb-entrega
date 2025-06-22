import type { Titular, Acomodacao, Hospedagem, Dependente, Telefone, Endereco, Documento } from "../types"
const API_BASE_URL = "http://localhost:8000"

// Titulares
export const titularesApi = {
  getAll: async (): Promise<Titular[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/titulares`)
      if (!response.ok) {
        throw new Error(`Erro ao buscar titulares: ${response.status}`)
      }
      const data = await response.json()
      console.log('Resposta da API:', data)
      return data
    } catch (error) {
      console.error('Erro ao buscar titulares:', error)
      throw error
    }
  },

  getById: async (id: number): Promise<Titular> => {
    const response = await fetch(`${API_BASE_URL}/titulares/${id}`)
    return response.json()
  },

  create: async (titular: Omit<Titular, "id">): Promise<Titular> => {
    const titularFormatado = {
      ...titular,
      data_nascimento: titular.data_nascimento.split('T')[0],
      documentos: titular.documentos?.map(doc => ({
        ...doc,
        data_emissao: doc.data_emissao.split('T')[0]
      }))
    };
    console.log('Dados do titular formatados:', titularFormatado);
    const response = await fetch(`${API_BASE_URL}/titulares`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(titularFormatado),
    })
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Erro da API:', errorData);
      throw new Error(errorData.detail || 'Erro ao criar titular')
    }
    return response.json()
  },

  update: async (id: number, titular: Partial<Titular>): Promise<Titular> => {
    const response = await fetch(`${API_BASE_URL}/titulares/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(titular),
    })
    return response.json()
  },

  delete: async (id: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/titulares/${id}`, {
      method: "DELETE",
    })
  },

  // Endpoints para relacionamentos
  addDependente: async (titular_id: number, dependente: Omit<Dependente, "id" | "titular_id">): Promise<Dependente> => {
    const response = await fetch(`${API_BASE_URL}/titulares/${titular_id}/dependentes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dependente),
    })
    return response.json()
  },

  addTelefone: async (titular_id: number, telefone: Omit<Telefone, "id" | "titular_id">): Promise<Telefone> => {
    const response = await fetch(`${API_BASE_URL}/titulares/${titular_id}/telefones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(telefone),
    })
    return response.json()
  },

  addEndereco: async (titular_id: number, endereco: Omit<Endereco, "id" | "titular_id">): Promise<Endereco> => {
    const response = await fetch(`${API_BASE_URL}/titulares/${titular_id}/enderecos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(endereco),
    })
    return response.json()
  },

  addDocumento: async (titular_id: number, documento: Omit<Documento, "id" | "titular_id">): Promise<Documento> => {
    const response = await fetch(`${API_BASE_URL}/titulares/${titular_id}/documentos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(documento),
    })
    return response.json()
  },
}

// Acomodações
export const acomodacoesApi = {
  getAll: async (): Promise<Acomodacao[]> => {
    const response = await fetch(`${API_BASE_URL}/acomodacoes`)
    return response.json()
  },

  create: async (acomodacao: Omit<Acomodacao, "id">): Promise<Acomodacao> => {
    console.log('JSON enviado para o backend:', JSON.stringify(acomodacao, null, 2))
    const response = await fetch(`${API_BASE_URL}/acomodacoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(acomodacao),
    })
    return response.json()
  },

  update: async (id: number, acomodacao: Partial<Acomodacao>): Promise<Acomodacao> => {
    const response = await fetch(`${API_BASE_URL}/acomodacoes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(acomodacao),
    })
    return response.json()
  },

  delete: async (id: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/acomodacoes/${id}`, {
      method: "DELETE",
    })
  },
}

// Hospedagens
// Dependentes
export const dependentesApi = {
  getAll: async (): Promise<Dependente[]> => {
    const response = await fetch(`${API_BASE_URL}/dependentes`)
    return response.json()
  },

  getById: async (id: number): Promise<Dependente> => {
    const response = await fetch(`${API_BASE_URL}/dependentes/${id}`)
    return response.json()
  },

  create: async (dependente: Omit<Dependente, "id">): Promise<Dependente> => {
    const dependenteFormatado = {
      ...dependente,
      data_nascimento: new Date(dependente.data_nascimento).toISOString().split('T')[0],
      documentos: dependente.documentos?.map(doc => ({
        ...doc,
        data_emissao: new Date(doc.data_emissao).toISOString().split('T')[0]
      }))
    };
    console.log('Dados do dependente formatados:', dependenteFormatado);
    const response = await fetch(`${API_BASE_URL}/dependentes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dependenteFormatado),
    })
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Erro da API:', errorData);
      throw new Error(errorData.detail || 'Erro ao criar dependente')
    }
    return response.json()
  },

  update: async (id: number, dependente: Partial<Dependente>): Promise<Dependente> => {
    const response = await fetch(`${API_BASE_URL}/dependentes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dependente),
    })
    return response.json()
  },

  delete: async (id: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/dependentes/${id}`, {
      method: "DELETE",
    })
  },

  addDocumento: async (dependente_id: number, documento: Omit<Documento, "id" | "dependente_id">): Promise<Documento> => {
    const documentoFormatado = {
      ...documento,
      data_emissao: new Date(documento.data_emissao).toISOString().split('T')[0]
    };
    const response = await fetch(`${API_BASE_URL}/dependentes/${dependente_id}/documentos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(documentoFormatado),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Erro ao adicionar documento')
    }
    return response.json()
  },
}

// Endereços
export const enderecosApi = {
  getAll: async (): Promise<Endereco[]> => {
    const response = await fetch(`${API_BASE_URL}/enderecos`)
    return response.json()
  },

  getById: async (id: number): Promise<Endereco> => {
    const response = await fetch(`${API_BASE_URL}/enderecos/${id}`)
    return response.json()
  },

  update: async (id: number, endereco: Partial<Endereco>): Promise<Endereco> => {
    const response = await fetch(`${API_BASE_URL}/enderecos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(endereco),
    })
    return response.json()
  },

  delete: async (id: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/enderecos/${id}`, {
      method: "DELETE",
    })
  },
}

// Telefones
export const telefonesApi = {
  getAll: async (): Promise<Telefone[]> => {
    const response = await fetch(`${API_BASE_URL}/telefones`)
    return response.json()
  },

  getById: async (id: number): Promise<Telefone> => {
    const response = await fetch(`${API_BASE_URL}/telefones/${id}`)
    return response.json()
  },

  update: async (id: number, telefone: Partial<Telefone>): Promise<Telefone> => {
    const response = await fetch(`${API_BASE_URL}/telefones/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(telefone),
    })
    return response.json()
  },

  delete: async (id: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/telefones/${id}`, {
      method: "DELETE",
    })
  },
}

// Hospedagens
export const hospedagensApi = {
  getAll: async (): Promise<Hospedagem[]> => {
    const response = await fetch(`${API_BASE_URL}/hospedagens`)
    return response.json()
  },

  create: async (hospedagem: Omit<Hospedagem, "id" | "titular" | "acomodacao">): Promise<Hospedagem> => {
    console.log('Dados da hospedagem enviados:', JSON.stringify(hospedagem, null, 2));
    const response = await fetch(`${API_BASE_URL}/hospedagens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hospedagem),
    })
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Erro da API:', errorData);
      throw new Error(errorData.detail || 'Erro ao criar hospedagem')
    }
    return response.json()
  },

  update: async (id: number, hospedagem: Partial<Omit<Hospedagem, "id" | "titular" | "acomodacao">>): Promise<Hospedagem> => {
    const response = await fetch(`${API_BASE_URL}/hospedagens/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hospedagem),
    })
    return response.json()
  },

  delete: async (id: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/hospedagens/${id}`, {
      method: "DELETE",
    })
  },
}
