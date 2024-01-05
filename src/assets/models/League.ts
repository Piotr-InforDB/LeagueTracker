import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import axios from "axios";
import {Player} from "./Player";
import {PlayerRank} from "./PlayerRank";
import {PlayerMastery} from "./PlayerMastery";



export class League{

  public syncing = false;
  public message = '';

  private apiKey = 'RGAPI-7ff27bf4-ad0c-4a33-912e-b7c0be3904cc';
  private region = 'euw1';
  private fullRegion = 'europe';

  public players = [] as any;

  constructor() {}


  public async init(){
    await this.initLocalDB();
    await this.refreshPlayers();
  }

  public async query(path: string, fullRegion = false){
    this.message = '';
    path = `${path}?api_key=${this.apiKey}`

    return new Promise(resolve => {

      axios.post(
        `https://cors.meandthebois.com/`,
        `url=${encodeURIComponent(`https://${fullRegion ? this.fullRegion : this.region}.api.riotgames.com/${path}`)}`, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(response => {

          resolve({
            status: true,
            data: response.data,
          });

        })
        .catch(err => {

          this.message = 'RIOT API unavailable'
          if(err?.data?.status?.message){
            this.message = err.data.status.message
          }

          resolve({
            status: false,
          });

        })

    })
  }

  //Players
  async findPlayers(name: string){
    if(name.includes('#')){
      return this.findPlayersWithTag(name);
    }

    const path = `lol/summoner/v4/summoners/by-name/${name}`
    const response =  await this.query(path) as any;
    return response.status ? new Player(response.data) : null;
  }
  async findPlayersWithTag(name:string){
    const nameData = name.split('#');

    const path = `riot/account/v1/accounts/by-riot-id/${nameData[0]}/${nameData[1]}`
    const playerData = await this.query(path, true) as any;

    if(!playerData.status){ return playerData; }

    return await this.findPlayerByPuuid(playerData.data.puuid);
  }
  async findPlayerByPuuid(puuid: string){
    const path = `lol/summoner/v4/summoners/by-puuid/${puuid}`
    const response =  await this.query(path) as any;
    return response.status ? new Player(response.data) : null;
  }

  findStoredPlayerByPuuid(puuid: string){
    return this.players.find((player: any) => player.puuid == puuid);;
  }

  playerIcon(id: number){
    return `https://ddragon-webp.lolmath.net/latest/img/profileicon/${id}.webp`
  }

  storePlayer(player: Player){
    this.players.push(new Player(player));
    this.refreshPlayers();
  }
  playerIsStored(puuid: string){
    const check = this.players.find((player: any) => player.puuid == puuid);
    return !!(check);
  }

  async refreshPlayers(){

    for(const player of this.players){
      await player.refreshRank();
      await player.refreshMastery();
    }

    this.syncLocalDB();
  }



  //Database
  public async initLocalDB(){
    console.log('initLocalDB');
    await Filesystem.requestPermissions()

    try {
      const response = await Filesystem.readFile({
        path: 'LeagueTrackerSettings.json',
        directory: Directory.Data
      });

      let data;


      if (response.data instanceof Blob) {
        const text = await response.data.text();
        data = JSON.parse(text);
      }
      else if(this.isJson(response.data)){
        data = JSON.parse(response.data);
      }
      else {
        const decodedString = atob(response.data);
        data = JSON.parse(decodedString);
      }



      this.loadLocalDB(data);
      return;

    } catch (err) {
      console.log('initLocalDB Error');
      await this.createLocalDB();
      return true;
    }
  }
  public async createLocalDB(){
    try {
      await Filesystem.writeFile({
        path: 'LeagueTrackerSettings.json',
        data: JSON.stringify({}),
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });
    } catch (err) {
      console.log('Error');
      throw err; // Throw the error to be handled by the caller
    }
  }
  public async loadLocalDB(data: any){
    console.log('loadLocalDB');
    this.players = [];
    if(data?.players?.length){
      data.players.forEach( (player: any) => { this.players.push(new Player(player)) } )
    }
    console.log(this.players);
  }
  public async syncLocalDB(){
    const data = {
      players: this.players,
    };

    console.log(data);

    try {
      await Filesystem.writeFile({
        path: 'LeagueTrackerSettings.json',
        data: JSON.stringify(data),
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });
    } catch (err) {
      console.error('Failed to store', err);
    }
  }

  //Utiles
  isJson(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }


}
