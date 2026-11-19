// V1 numbering follows the reference sheet, not an invented taxonomy.
const list=[
 ['shaved','Rasée',1,'bob','bald','Crâne dégagé, sans calotte.'],
 ['short','Courte ébouriffée',2,'classic','short','Petites pointes irrégulières, volume près du crâne.'],
 ['classic','Classique courte',3,'classic','original','Mèche latérale validée dans P3-R1.'],
 ['bob','Carré court',4,'bob','original','Raie centrale et panneaux arrondis validés dans R1.'],
 ['fringe_bob','Carré à frange',5,'bob','fringe','Frange pleine, coupe droite au menton.'],
 ['mid_waves','Mi-longs ondulés',6,'bob','waves','Ondulations souples jusqu’aux épaules.'],
 ['long_straight','Longs lisses',7,'bob','straight','Raie centrale, longueurs brunes derrière les épaules.'],
 ['curls','Boucles courtes',8,'curls','original','Boucles courtes validées dans P3-R1.'],
 ['long_curls','Boucles longues',9,'curls','curls','Masse de boucles épaisses jusqu’à la poitrine.'],
 ['braids','Tresses',10,'bob','braids','Deux tresses blondes devant les épaules.'],
 ['bun','Attaché · chignon',11,'bob','bun','Chignon haut et petites mèches près des oreilles.'],
 ['pony','Queue de cheval',12,'classic','pony','Attache haute décentrée, queue courbe derrière l’épaule.'],
 ['waist_straight','Très longs lisses',null,'bob','straight','Rideaux lisses devant le buste, pointes à la taille.'],
 ['waist_waves','Très longs ondulés',null,'bob','waves','Vagues amples et épaisses jusqu’à la taille.'],
 ['waist_curls','Très longues boucles',null,'curls','curls','Cascade de boucles larges, jusqu’à la taille.'],
 ['afro','Afro ample',null,'curls','afro','Couronne ronde très volumineuse, contour en gros lobes.'],
 ['side_braid','Natte sur l’épaule',null,'bob','braid','Raie décentrée, une natte épaisse devant l’épaule droite.'],
 ['asym_long','Asymétrique · carré et cascade',null,'bob','asym','Carré à gauche, longue cascade ondulée à droite.']
];
const palettes={blond:['#c69d46','#94712f','#dfba64'],brown:['#94612d','#69451f','#b38344'],dark:['#79512b','#5e401f','#a07545'],copper:['#b77c35','#875a28','#d49b51']};
export const styles=Object.freeze(Object.fromEntries(list.map(([id,name,v1,cap,kind,note])=>{
 const palette=['mid_waves','braids','pony','waist_waves','side_braid'].includes(id)?'blond':['long_straight','waist_straight'].includes(id)?'dark':['long_curls','waist_curls','afro'].includes(id)?'copper':'brown';
 return [id,Object.freeze({id,name,v1,cap,kind,note,color:palettes[palette][0],contour:palettes[palette][1],light:palettes[palette][2]})];
})));
export const bodies=Object.freeze({
 standard:{name:'Corps de référence',values:{silhouette:'tee',chest:'plain'}},
 slim:{name:'Silhouette mince',values:{silhouette:'column',shoulders:.85,belly:.8,hips:.85,chest:'plain'}},
 broad:{name:'Silhouette large',values:{silhouette:'trapezoid',shoulders:1.12,belly:1.3,hips:1.2,chest:'plain'}},
 narrow:{name:'Épaules étroites',values:{silhouette:'hourglass',shoulders:.72,belly:1,hips:1.12,chest:'plain'}},
 shoulders:{name:'Épaules larges',values:{silhouette:'tee',shoulders:1.25,belly:1,hips:1,chest:'plain'}},
 bust:{name:'Buste volumineux',values:{silhouette:'pear',shoulders:1.25,belly:1.25,hips:1.12,chest:'curves'}}
});
