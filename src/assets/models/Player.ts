import {PlayerRank} from "./PlayerRank";
import {PlayerMastery} from "./PlayerMastery";
import {League} from "./League";
import {time} from "ionicons/icons";
import {Match} from "./Match";

export class Player{

  public league = new League();

  public id: string;
  public accountId: string;
  public puuid: string;
  public name: string;
  public profileIconId: number;
  public revisionDate: number;
  public summonerLevel: number;

  public _ranks: PlayerRank[] = [];
  public _masteries: PlayerMastery[] = [];
  public _matches: Match[] = [];
  public _lastUpdates: any;

  constructor(player: any){
    this.id = player.id;
    this.accountId = player.accountId;
    this.puuid = player.puuid;
    this.name = player.name;
    this.profileIconId = player.profileIconId;
    this.revisionDate = player.revisionDate;
    this.summonerLevel = player.summonerLevel;

    this._ranks = player._ranks ? player._ranks.map((rank: any) => new PlayerRank(rank)) : [];
    this._masteries = player._masteries ? player._masteries.map((mastery: any) => new PlayerMastery(mastery)) : [];
    this._matches = player._matches ? player._matches.map((match: any) => new Match(match)) : [];
    this._lastUpdates = player._lastUpdates ? player._lastUpdates : { rank: 0, mastery: 0, matchHistory: 0, };
  }


  icon(){
    return `https://ddragon-webp.lolmath.net/latest/img/profileicon/${this.profileIconId}.webp`
  }
  rank(type: string){
    return this._ranks.find((rank: any) => rank.queueType == type)
  }

  async refreshRank(){
    const timestamp = this.shouldUpdate(this._lastUpdates.rank);
    if(!timestamp){ return; }

    const path = `lol/league/v4/entries/by-summoner/${this.id}`;
    const ranksData = await this.league.query(path) as any;

    if(!ranksData.status){ return; }

    this._ranks = ranksData.data.map((rank:any) => new PlayerRank(rank));
    this._lastUpdates.rank = timestamp;
  }
  async refreshMastery(){
    const timestamp = this.shouldUpdate(this._lastUpdates.mastery);
    if(!timestamp){ return; }

    const path = `lol/champion-mastery/v4/champion-masteries/by-puuid/${this.puuid}/top`;
    const champsData = await this.league.query(path) as any;

    if(!champsData.status){ return; }

    this._masteries = champsData.data.map((mastery:any) => new PlayerMastery(mastery));
    this._lastUpdates.mastery = timestamp;
  }
  async refreshMatchHistory(){
    const timestamp = this.shouldUpdate(this._lastUpdates.matchHistory);
    if(!timestamp){ return; }

    let path = `lol/match/v5/matches/by-puuid/${this.puuid}/ids`
    const matchIdsData = await this.league.query(path, true) as any;

    if(!matchIdsData.status){ return; }

    for(const id of matchIdsData.data){
      await this.storeMatch(id);
    }

  }

  public mainChampion(){
    if(!this._masteries.length){ return false }
    return this._masteries[0];
  }

  private async storeMatch(id: string){
    const check = this._matches.find((match: Match) => match.metadata.matchId == id);
    if(check){ return; }

    const path = `lol/match/v5/matches/${id}`;
    const matchData = await this.league.query(path, true) as any;

    if(!matchData.status){ return }

    this._matches.push(new Match(matchData.data));
    this.orderMatches();
  }
  private orderMatches(){
    this._matches.sort((a: Match, b: Match) => {
      const a_id = Number((a.metadata.matchId.split('_'))[0]);
      const b_id = Number((b.metadata.matchId.split('_'))[0]);
      return b_id - a_id;
    })
  }
  private shouldUpdate(last: number = 0){
    const timestamp = new Date().getTime();
    if(timestamp < (last + (2 * 60 * 1000))){ return false; }

    return timestamp;
  }


}
