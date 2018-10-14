<template>
   <div style='position:relative'>
      <h2>Vue地理定位</h2>
      <button @click='GetCode'>点击定位</button>
      <p>您当前所在的位置是</p>
      <div v-if='!loadingActive'>
         <p>省：{{provinceText}}</p>
         <p>市：{{cityText}}</p>
         <p>区/县：{{countyText}}</p>
         <p>详细地址：{{address}}</p>
      </div>
      <p v-if='loadingActive'>请稍后........</p>
   </div>
</div>
</template>

<script>
   export default {
      name: 'hello',
      data () {
         return {
            loadingActive: false,
            provinceText: '',
            cityText:'',
            countyText: '',
            address: '',
            areaText: ''
         }
      },
      methods:{
         GetCode(){
            this.loadingActive = true
            let map, geolocation,isRegeo=true;
            map = new AMap.Map('container', { resizeEnable: true});
            map.plugin('AMap.Geolocation', ()=>{
               geolocation = new AMap.Geolocation({
                  enableHighAccuracy: true,
                  timeout: 20000,
                  buttonOffset: new AMap.Pixel(10, 20),
                  zoomToAccuracy: true,
                  buttonPosition:'RB'
               });
               geolocation.getCurrentPosition();
               AMap.event.addListener(geolocation, 'complete', (data)=>{
                  console.log('定位成功===>')
                  console.log('经度：' + data.position.getLng())
                  console.log('纬度：' + data.position.getLat())
                  console.log('精度：' + data.accuracy + '米')
                  console.log('是否经过偏移：' + (data.isConverted ? '是' : '否'))
                  if(isRegeo){
                     this.regeocoder([data.position.getLng(), data.position.getLat()],(result)=>{
                        console.log('定位地址------>>>' , result)
                        if(result){
                           this.areaText = '定位成功！'
                           setTimeout(()=>{
                              this.loadingActive = false
                           },1500)
                        }else{
                           this.areaText = '定位失败,请稍后再试!'
                           setTimeout(()=>{
                            this.loadingActive = false
                         },1500)
                        }
                        this.provinceText = result.province
                        if(result.city == ''){
                           this.cityText = result.province
                        }else{
                           this.cityText = result.city
                        }
                        this.countyText = result.district
                        this.address = result.address
                     })
                  }else{
                     complete(data.position.getLng(),data.position.getLat(),null)
                  }
               });
               AMap.event.addListener(geolocation, 'error',  (data)=>{
                  console.log('定位失败===>'+data.message)
               });
            });
         },
         regeocoder(lnglatXY,complete) {
            let resultInfo = {}
            let geocoder = new AMap.Geocoder({radius: 1000,extensions: "all"});
            geocoder.getAddress(lnglatXY, (status, result)=>{
               if (status === 'complete' && result.info === 'OK') {
                  let addressComponent = result.regeocode.addressComponent;
                  let aois = result.regeocode.aois;
                  let crosses = result.regeocode.crosses;
                  let pois = result.regeocode.pois;
                  let roads = result.regeocode.roads;
                  let address = result.regeocode.formattedAddress;
                  resultInfo.address = result.regeocode.formattedAddress;
                  resultInfo.province = addressComponent.province;
                  resultInfo.city = addressComponent.city;
                  resultInfo.citycode = addressComponent.citycode;
                  resultInfo.district = addressComponent.district;
                  resultInfo.adcode = addressComponent.adcode;
                  resultInfo.township = addressComponent.township;
                  resultInfo.street = addressComponent.street;
                  resultInfo.streetNumber = addressComponent.streetNumber;
                  resultInfo.neighborhood = addressComponent.neighborhood;
                  resultInfo.neighborhoodType = addressComponent.neighborhoodType;
                  resultInfo.building = addressComponent.building;
                  complete(resultInfo)
               }
            })
         } 
      }
   }
</script>
<style scoped>
   span{
      color: #FEB101;
   }
   button{
      background: #FEB101;
      color: #fff;
      height: 40px;
      width: 100px;
      border:none;
      border-radius: 5px;
      outline: none;
   }
   button:active{
      opacity: 0.8;
   }
</style>
