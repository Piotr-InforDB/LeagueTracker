import { Component, OnInit } from '@angular/core';
import {League} from "../../assets/models/League";
import {Router} from "@angular/router";

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
  providers: [League,]
})
export class IndexPage{

  public league = new League();

  public inputs = {
    localPlayerSearch: ''
  };
  public messages = {
    localPlayerSearch: '',
  }
  public modals = {
    localPlayer: false,
  }
  public data = {
    localPlayer: null as any,
  }

  constructor(
    private router: Router,
  ) {
    this.league.init();
  }

  ionViewWillEnter(){

  }
  refresh(event: any) {
    this.league.refreshPlayers();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  addLocalPlayer(){
    this.clearMessages();
    this.modals.localPlayer = true;
    this.data.localPlayer = null;
  }
  async findLocalPlayer(){
    this.clearMessages();
    this.data.localPlayer = null;

    this.inputs.localPlayerSearch = this.inputs.localPlayerSearch.replace(/\s/g, '');

    if(!this.inputs.localPlayerSearch){
      this.messages.localPlayerSearch = `Input can't be empty!`;
      return;
    }

    const player = await this.league.findPlayers(this.inputs.localPlayerSearch) as any;
    if(!player){
      this.messages.localPlayerSearch = 'Player not found!'
      return;
    }

    this.data.localPlayer = player;
  }
  storeLocalPlayer(){
    this.modals.localPlayer = false;
    this.league.storePlayer(this.data.localPlayer);
  }

  playerHistory(puuid: string){
    this.router.navigate(['tabs/history'], {
      state: {puuid: puuid,}
    });
  }

  clearMessages(){
    for(const index in this.messages){
      // @ts-ignore
      this.messages[index] = '';
    }
  }


}
