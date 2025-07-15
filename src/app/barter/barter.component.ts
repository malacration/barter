import { Component, inject, OnDestroy, OnInit, resource } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { FluidModule } from 'primeng/fluid';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CountryService } from '../pages/service/country.service';
import { NodeService } from '../pages/service/node.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { Cartao, Taxa } from './cartao';
import { BarterService } from '../_services/barter.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { interval, Observable, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-barter',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    DatePickerModule,
    CardModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    InputGroupModule,
    FloatLabelModule,
    FluidModule,
    InputNumberModule,
    InputGroupAddonModule,
    DividerModule,
    SelectModule,
    RadioButtonModule,
    ProgressBarModule,
  ],
  templateUrl: './barter.component.html',
  styleUrl: './barter.component.scss',
  providers: [CountryService, NodeService,BarterService]
})
export class BarterComponent implements OnInit, OnDestroy{

  constructor(private service : BarterService) {
    (window as any).enableDebug = () => {
      this.visualizaCalculo = true;
      console.log('Debug Mode ATIVADO!');
    };

    (window as any).disableDebug = () => {
      this.visualizaCalculo = false;
      console.log('Debug Mode DESATIVADO!');
    };
    service.getPreco("")
  }

  loading = true
  erroMessage? : string
  subscription? : Subscription
  seguro : number = 0

  tipoVeiculoSelecionada = "leve"

  tiposVeiculos = [
    { value: 'leve', label: 'Leve'},
    { value: 'pesado', label: 'Pesado'}
  ]

  retencaoTipo : string = 'funrural'

  getTaxaRetencao() : number {
    return this.retencaoTipo  == 'funrural' ? 0.015 : 0.0002
  }

  ngOnInit(): void {
    this.changeItem(null)
  }

  changeItem($event: any) {
    if(this.subscription)
      this.subscription.unsubscribe()

    let intervalo = 1800000  // 30 minutos em milissegundos
    this.subscription = interval(intervalo)
      .pipe(
        startWith(0), // Faz a requisição imediatamente ao iniciar o componente
        switchMap(() => {
          this.loading = true; // Ativa o loading antes da requisição iniciar
          return this.service.getPreco(this.itemBarterSelecionado);
        })
      )
      .subscribe({
        next: it => {
          if (it.Price) {
            this.valorSaco = it.Price;
            this.erroMessage = undefined
            this.loading = false;
          }else{
            this.erroMessage = "Foi possivel consultar o sistema mas não foi encontrato preço para o saco da soja"
          }
        },
        error: it => {
          this.erroMessage = "Erro ao obter o valor do Saco da soja";
        }
      });
  }

  getItemLabel(): string {
    const selectedItem = this.itensBarter.find(item => item.value == this.itemBarterSelecionado);
    return selectedItem ? selectedItem.label : 'Item não encontrado';
  }

  isVeiculoLeve() : boolean{
    return this.tipoVeiculoSelecionada == "leve"
  }

  itemBarterSelecionado: string = 'GRA0000004';

  visualizaCalculo = false

  jurosAoMes = 0.025
  dolar = 5.70
  valorSaco = 125

  valorPrincipal : number = 0
  private _valorEntrada : number = 0
  
  get valorEntrada(): number { return this._valorEntrada; }
  
  set valorEntrada(value: number | null | undefined) {
    const v = Number(value) || 0;
    const factor = 100;
    this._valorEntrada = Math.ceil(v * factor - 1e-9) / factor;
  }
  
  valorEntradaParcelado : number = 0
  valorEncargos = 0
  dataEntrega : Date = new Date(2026, 2)

  taxaAdm = new Taxa(0.01, 0.0278, 0.0287, 0.0322)
  
  taxaAntecipacao = new Taxa(0, 0.016, 0.016, 0.016)

  cartao = new Cartao("generico",this.taxaAdm,this.taxaAntecipacao)

  parcelas = [
    { value: -1, label: 'Débito'},
    { value: 1, label: '1x'},
    { value: 2, label: '2x' },
    { value: 3, label: '3x' },
    { value: 4, label: '4x' },
    { value: 5, label: '5x' },
    { value: 6, label: '6x' },
    { value: 7, label: '7x' },
    { value: 8, label: '8x' },
    { value: 9, label: '9x' },
    { value: 10, label: '10x' },
    { value: 11, label: '11x' },
    { value: 12, label: '12x' },
  ];

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  itensBarter = [
    { value: 'INS0000015', label: 'MILHO'},
    { value: 'GRA0000004', label: 'SOJA'}
  ]

  numParcelaEntradaCartao : number = 0
  
  taxaEncargosDebito = 0.01
  taxaEncargosCartaoAhVista = 0.0278
  taxaEncargosCartao2a6 = 0.0287
  taxaEncargosCartao7a12 = 0.0322

  get percentualEntrada() : number{
    if(!this.valorPrincipal)
      return 0
    return Math.trunc((this.valorEntrada+this.valorEntradaParcelado)/((this.valorPrincipal??0)+(this.valorEncargos??0))*100);
  }

  getValorFinanciar(): number {
    return (this.getCustoAntecipacao() + (this.valorPrincipal) + this.valorEncargos + this.getEncargosCartao() - (this.valorEntrada+this.valorEntradaParcelado));
  }

  getMesesPrazo(){
    const hoje = new Date();
    const fim = this.dataEntrega
    const meses = (fim.getFullYear() - hoje.getFullYear()) * 12 + (fim.getMonth() - hoje.getMonth());
    return meses
  }

  getValorParcela() : number{
    if(this.numParcelaEntradaCartao > 0)
      return this.valorEntradaParcelado/this.numParcelaEntradaCartao
    else
      return this.valorEntradaParcelado
  }

  getEncargosCartao() : number{
    return this.valorEntradaParcelado*this.getTaxaCartao()
  }

  getTaxaCartao() : number {
    if(!this.valorEntradaParcelado)
      return 0
    return this.cartao.taxaAdm.getTaxaByPrazo(this.numParcelaEntradaCartao)
  }

  getTaxaAntecipacao(){
    return this.cartao.taxaAntecipacao.getTaxaByPrazo(6)
  }

  getCustoAntecipacao() : number{
    let taxaAntecipacao = this.getTaxaAntecipacao()
    let valorParcela = (this.valorEntradaParcelado-this.getEncargosCartao())/this.numParcelaEntradaCartao;
    let dias = 30
    let montanteCustoAntecipacao = 0.0
    for(let i = 1; i<=this.numParcelaEntradaCartao; i++){
      montanteCustoAntecipacao = montanteCustoAntecipacao+(valorParcela*dias*taxaAntecipacao/30);
      dias += 30
    }
    return montanteCustoAntecipacao
  }

  getValorRetencao() : number{
    return this.getMontanteFinal()*this.getTaxaRetencao()
  }

  getMontanteFinal(): number {
    return this.getMontanteFinalSemRetencoes()/(1-this.getTaxaRetencao());
  }

  getMontanteFinalSemRetencoes(): number {
    const meses = this.getMesesPrazo()
    const valorFinanciar = this.getValorFinanciar();
    return (valorFinanciar * Math.pow(1 + this.jurosAoMes, meses));
  }

  getNumeroSacosSemArredondamento() : number{
    return Math.ceil(this.getMontanteFinal() / this.valorSaco);
  }

  getNumeroSacos(){
    if(this.arredondamento() < 0)
      return this.getNumeroSacosSemArredondamento()+1
    return this.getNumeroSacosSemArredondamento()
  }

  arredondamento() : number{
    return this.getMontanteFinal()-(this.getNumeroSacosSemArredondamento()*this.valorSaco)
  }

  getResidualPrincipal() : number{
    return this.valorPrincipal-this.valorEntrada-this.valorEntradaParcelado
  }

  

  //Valor do bem
  //porcentagem bind com valor da entrada
  //change label para encargo 
  //adicao de cartao de credito mais entrada a vista mais selecao de numero de parcelas - Encargo
  //Data entrega

  valorMinimoEntrada(){
    if(this.isVeiculoLeve())
      return (this.valorPrincipal??0)*0.20+(this.valorEncargos ?? 0)+(this.seguro ?? 0)
    else
      return 0
  }

  perncentualMinimo(){
    return Math.trunc((((this.valorPrincipal??0)*0.20)+(this.valorEncargos ?? 0)+(this.seguro ?? 0))/((this.valorPrincipal??0)+(this.valorEncargos ?? 0)+(this.seguro ?? 0))*100)
  }

  percentualEdit($event : string){
    this.valorEntrada = this.valorPrincipal??0/Number($event)
  }

  changeBaseEntrada(){
    this.valorEntrada = this.valorMinimoEntrada()
  }

  changeEntradaDinheiro(){
    if(!this.valorEntrada)
      this.valorEntrada = 0
  }

  isFormularioValido() : boolean{
    return (this.percentualEntrada >= this.perncentualMinimo() && this.isParceladoValido()) || !this.isVeiculoLeve()
  }

  isParceladoValido(){
    return (this.valorEntradaParcelado > 0 && this.numParcelaEntradaCartao != 0) || this.valorEntradaParcelado <= 0
  }
}
