export class PlayerMastery{

  public puuid;
  public championId;
  public championLevel;
  public championPoints;
  public lastPlayTime;
  public championPointsSinceLastLevel;
  public championPointsUntilNextLevel;
  public chestGranted;
  public tokensEarned;
  public summonerId;

  public _formattedMastery = 0;
  public _splash;
  public _icon;


  constructor(mastery: any) {
    this.puuid = mastery.puuid;
    this.championId = mastery.championId;
    this.championLevel = mastery.championLevel;
    this.championPoints = mastery.championPoints;
    this.lastPlayTime = mastery.lastPlayTime;
    this.championPointsSinceLastLevel = mastery.championPointsSinceLastLevel;
    this.championPointsUntilNextLevel = mastery.championPointsUntilNextLevel;
    this.chestGranted = mastery.chestGranted;
    this.tokensEarned = mastery.tokensEarned;
    this.summonerId = mastery.summonerId;


    // this._splash = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${this.championId}_0.jpg`
    this._formattedMastery = this.championPoints.toLocaleString();
    this._icon = `https://cdn.communitydragon.org/13.24.1/champion/${this.championId}/tile`
    this._splash = `https://cdn.communitydragon.org/13.24.1/champion/${this.championId}/splash-art/skin/0`
  }



}
