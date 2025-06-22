export interface Titular {
    id: number;
    nome: string;
    nome_social?: string;
    data_nascimento: string;
    enderecos: Endereco[];
    telefones: Telefone[];
    documentos: Documento[];
    dependentes: Dependente[];
}

export interface Dependente {
    id: number;
    titular_id: number;
    nome: string;
    nome_social?: string;
    data_nascimento: string;
    documentos: Documento[];
}

export interface Endereco {
    id: number;
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
}

export interface Telefone {
    id: number;
    ddd: string;
    numero: string;
}

export enum TipoDocumento {
    CPF = 'CPF',
    RG = 'RG',
    PASSAPORTE = 'PASSAPORTE'
}

export interface Documento {
    id: number;
    tipo: TipoDocumento;
    numero: string;
    data_emissao: string;
}

export interface Acomodacao {
    id: number;
    nome_acomodacao: TipoAcomodacao;
    cama_solteiro: number
    cama_casal: number;
    suite: number;
    climatizacao: boolean;
    garagem: number;
    
}

export interface Hospedagem {
    id: number;
    cliente_id: number;
    acomodacao_id: number;
    entrada: string;
    saida: string;
    titular?: Titular;
    acomodacao?: Acomodacao;
}

export enum TipoAcomodacao {
    SolteiroSimples = 'Acomodação simples para solteiro(a)',
    CasalSimples = 'Acomodação simples para casal',
    FamiliaSimples = 'Acomodação para família com até duas crianças',
    FamiliaMais = 'Acomodação para família com até cinco crianças',
    SolteiroMais = 'Acomodação com garagem para solteiro(a)',
    FamiliaSuper = 'Acomodação para até duas familias, casal e três crianças cada'
}
