export class Match {

  public metadata = {} as any;
  public info = {} as any

  public queries = {
    playerWon: {} as any,
  }

  constructor(match: any) {

    this.metadata = match.metadata;
    this.info = match.info;


  }



  public playerWon(puuid: string){
    if(this.queries.playerWon[puuid]){ return this.queries.playerWon[puuid] }

    const participant = this.participant(puuid);
    const team = this.team(participant.teamId);

    this.queries.playerWon[puuid] = team.win;
    return team.win;
  }
  public playerOutcome(puuid: string){
    return this.playerWon(puuid) ? 'Victory' : 'Defeat';
  }
  public playerKda(puuid: string){
    const participant = this.participant(puuid);
    return {
      kills: participant.kills,
      deaths: participant.deaths,
      assists: participant.assists,
    }
  }
  public playerChampionIcon(puuid: string){
    const participant = this.participant(puuid);
    return `https://cdn.communitydragon.org/13.24.1/champion/${participant.championId}/tile`
  }

  private participant(puuid: string){
    return this.info.participants.find((info: any) => info.puuid == puuid);
  }
  private team(id: number){
    return this.info.teams.find((team: any) => team.teamId == id);
  }


}
