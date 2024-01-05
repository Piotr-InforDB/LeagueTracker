import { Component, OnInit } from '@angular/core';
import {League} from "../../assets/models/League";
import {Router} from "@angular/router";
import {Player} from "../../assets/models/Player";
import {PlayerRank} from "../../assets/models/PlayerRank";
import {Match} from "../../assets/models/Match";

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  providers: [League],
})
export class HistoryPage {

  public league = new League();
  public player: Player|null = null;
  public ranks = {
    soloQ: undefined as PlayerRank|undefined,
    flex: undefined as PlayerRank|undefined,
  }
  public matches: Match[] = []
  public options = {
    storedPlayer: false,
  }

  constructor() {}

  async ionViewWillEnter(){
    await this.league.initLocalDB();

    let puuid = history.state.puuid;
    if (!puuid) {
      if(!this.league.players.length){ return; }
      puuid = this.league.players[0].puuid;
    }

    if(this.league.playerIsStored(puuid)){
      this.options.storedPlayer = true;
      this.player = this.league.findStoredPlayerByPuuid(puuid);
    }
    else{
      this.player = await this.league.findPlayerByPuuid(puuid);
    }

    if(!this.player){ return; }



    await this.player.refreshRank();
    await this.player.refreshMatchHistory();

    if(this.options.storedPlayer){
      await this.league.syncLocalDB();
    }

    this.ranks.soloQ = this.player.rank('RANKED_SOLO_5x5');
    this.ranks.flex = this.player.rank('RANKED_FLEX_SR');
    this.matches = this.player._matches;
  }


}
