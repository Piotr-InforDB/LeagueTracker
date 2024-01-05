export class PlayerRank{

  public leagueId: string;
  public queueType: string;
  public tier: string;
  public rank: string;
  public summonerId: string;
  public summonerName: string;
  public leaguePoints: number;
  public wins: number;
  public losses: number;
  public veteran: boolean;
  public inactive: boolean;
  public freshBlood: boolean;
  public hotStreak: boolean;

  public _icon: string;

  constructor(rank: any) {
    this.leagueId = rank.leagueId;
    this.queueType = rank.queueType;
    this.tier = rank.tier;
    this.rank = rank.rank;
    this.summonerId = rank.summonerId;
    this.summonerName = rank.summonerName;
    this.leaguePoints = rank.leaguePoints;
    this.wins = rank.wins;
    this.losses = rank.losses;
    this.veteran = rank.veteran;
    this.inactive = rank.inactive;
    this.freshBlood = rank.freshBlood;
    this.hotStreak = rank.hotStreak;


    this._icon = this.rank ? `assets/league/ranks/${this.tier.toLowerCase()}.png` : '';
  }

}
