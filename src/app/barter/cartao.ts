export class Taxa {
    taxaDebito: number;
    taxa1x: number;
    taxa2a6: number;
    taxa7a12: number;
  
    constructor(
      taxaDebito: number = 0.01,
      taxa1x: number = 0.0278,
      taxa2a6: number = 0.0287,
      taxa7a12: number = 0.0322
    ) {
      this.taxaDebito = taxaDebito;
      this.taxa1x = taxa1x;
      this.taxa2a6 = taxa2a6;
      this.taxa7a12 = taxa7a12;
    }


    getTaxaByPrazo(numParcelas : number){
        var taxa = this.taxa7a12
        
        if(numParcelas == -1)
            taxa = this.taxaDebito
        if(numParcelas == 1)
            taxa = this.taxa1x;
        if(numParcelas <= 6 && numParcelas >= 1)
            taxa =this.taxa2a6;
        return taxa
    }
}
  
export class Cartao {
    bandeira: string;
    taxaAdm: Taxa;
    taxaAntecipacao: Taxa;

    constructor(
        bandeira: string,
        taxaAdm: Taxa,
        taxaAntecipacao: Taxa
    ) {
        this.bandeira = bandeira;
        this.taxaAdm = taxaAdm;
        this.taxaAntecipacao = taxaAntecipacao;
    }
}
