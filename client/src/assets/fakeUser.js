export const getUser = ()=>{ //For getting a user detail ....duplicate it to get detail of all users
	//https://res.cloudinary.com/dv9k3us3f/video/upload/v1617712731/b1unsogvg23oxjry7yga.mp4
	const data = {
		fullname:"kanhaiya kumar",
		_id:1,
		username:"kk2000",
		isSubscribed:true, //Am i subscribed to this channel
		isAdmin:false,
		email:"kanhaiya_k@cs.iitr.ac.in",
		avatar:"https://kkleap.github.io/assets/default.jpg",
		website:"https://random.com",
		unseennotice:["hdhs","dhdhdh"],//we just need length of notice
		unseenmsg:["ddd","dshdh"],//we just need length of msg
		subscribers:["id1","id2"],//we just need length of subscribers
		videos:[
			{
				url:"https://res.cloudinary.com/dv9k3us3f/video/upload/v1618315460/drvy5kbnabydzmgkg9oe.mp4",
				title:"First",
				description:"A video upload example.This fat man is laughing too hard and in an amazing way",
				_id:"dhwdh",
				createdAt:1620642919208,
				visibility:"public",
				likesCount:212,
				dislikesCount:3,			
				views:3000,
			},
			{
				url:"https://res.cloudinary.com/dv9k3us3f/video/upload/v1617712731/b1unsogvg23oxjry7yga.mp4",
				title:"Second",
				_id:"dhsssdh",
				description:"A video upload example.Type of video is Romantic...This video should fall under romantic category",
				createdAt:1620642919108,
				visibility:"sub-only",
				likesCount:2212,
				dislikesCount:31,
				views:3000,

			},
			{
				url:"https://res.cloudinary.com/dv9k3us3f/video/upload/v1617712731/b1unsogvg23oxjry7yga.mp4",
				title:"Third",
				_id:"dhdxzh",
				description:"A video upload example.Type of video is Romantic...This video should fall under romantic category",
				createdAt:1620642919108,
				visibility:"custom",
				likesCount:212,
				dislikesCount:3,
				views:3000,

			},
			{
				url:"https://res.cloudinary.com/dv9k3us3f/video/upload/v1618315460/drvy5kbnabydzmgkg9oe.mp4",
				title:"First",
				_id:"dhxzdh",
				description:"A video upload example.This fat man is laughing too hard and in an amazing way",
				createdAt:1620642919208,
				visibility:"public",
				likesCount:212,
				dislikesCount:3,			
				views:3000,
			},
			{
				url:"https://res.cloudinary.com/dv9k3us3f/video/upload/v1617712731/b1unsogvg23oxjry7yga.mp4",
				title:"Second",
				_id:"dhcxdh",
				description:"A video upload example.Type of video is Romantic...This video should fall under romantic category",
				createdAt:1620642919108,
				visibility:"sub-only",
				likesCount:2212,
				dislikesCount:31,
				views:3000,

			},
			{
				url:"https://res.cloudinary.com/dv9k3us3f/video/upload/v1617712731/b1unsogvg23oxjry7yga.mp4",
				title:"Second",
				_id:"ssdhdh",
				description:"A video upload example.Type of video is Romantic...This video should fall under romantic category",
				createdAt:1620642919108,
				visibility:"custom",
				likesCount:212,
				dislikesCount:3,
				views:3000,

			},

{
				url:"https://res.cloudinary.com/dv9k3us3f/video/upload/v1618315460/drvy5kbnabydzmgkg9oe.mp4",
				title:"First",
				_id:"dhsadh",
				description:"A video upload example.This fat man is laughing too hard and in an amazing way",
				createdAt:1620642919208,
				visibility:"public",
				likesCount:212,
				views:3000,
				dislikesCount:3			

			},
			{
				url:"https://res.cloudinary.com/dv9k3us3f/video/upload/v1617712731/b1unsogvg23oxjry7yga.mp4",
				title:"Second",
				_id:"dhdddh",
				description:"A video upload example.Type of video is Romantic...This video should fall under romantic category",
				createdAt:1620642919108,
				visibility:"sub-only",
				likesCount:2212,
				views:3000,
				dislikesCount:31,
				

			},
			{
				url:"https://res.cloudinary.com/dv9k3us3f/video/upload/v1617712731/b1unsogvg23oxjry7yga.mp4",
				title:"Second",
				_id:"dhssdh",
				description:"A video upload example.Type of video is Romantic...This video should fall under romantic category",
				createdAt:1620642919108,
				visibility:"custom",
				views:3000,
				likesCount:212,
				dislikesCount:3,
				

			},

{
				url:"https://res.cloudinary.com/dv9k3us3f/video/upload/v1618315460/drvy5kbnabydzmgkg9oe.mp4",
				title:"First",
				views:3000,
				_id:"dhdhss",
				description:"A video upload example.This fat man is laughing too hard and in an amazing way",
				createdAt:1620642919208,
				visibility:"public",
				likesCount:212,
				dislikesCount:3			

			},
			{
				url:"https://res.cloudinary.com/dv9k3us3f/video/upload/v1617712731/b1unsogvg23oxjry7yga.mp4",
				views:3000,
				title:"Second",
				_id:"dhdhs",
				description:"A video upload example.Type of video is Romantic...This video should fall under romantic category",
				createdAt:1620642919108,
				visibility:"sub-only",
				likesCount:2212,
				dislikesCount:31,
				

			},
			{
				url:"https://res.cloudinary.com/dv9k3us3f/video/upload/v1617712731/b1unsogvg23oxjry7yga.mp4",
				views:3000,
				title:"Second",
				_id:"dhsdh",
				description:"A video upload example.Type of video is Romantic...This video should fall under romantic category",
				createdAt:1620642919108,
				visibility:"custom",
				likesCount:212,
				dislikesCount:3,
				

			},


		],
		history:[
			{
				url:"https://res.cloudinary.com/dv9k3us3f/video/upload/v1618315460/drvy5kbnabydzmgkg9oe.mp4",
				title:"First",
				views:3000,
				description:"A video upload example.This fat man is laughing too hard and in an amazing way",
				createdAt:1620642919208,
				_id:"11",
				visibility:"public",
				likesCount:212,
				dislikesCount:3,
				organiser:{
				   fullname:"kanhaiya kumar",
				   _id:"11",
				   username:"kk2000",
				   subscribers:["A","B","C"]//just have to take its length...
				}			

			},
			{
				url:"https://res.cloudinary.com/dv9k3us3f/video/upload/v1617712731/b1unsogvg23oxjry7yga.mp4",
				views:3000,
				title:"Second",
				_id:"czx",
				description:"A video upload example.Type of video is Romantic...This video should fall under romantic category",
				createdAt:1620642919108,
				visibility:"sub-only",
				likesCount:2212,
				dislikesCount:31,
				organiser:{
				   fullname:"kanhaiya kumar",
				   _id:"11",
				   username:"kk2000",
				   subscribers:["A","B","C"]//just have to take its length...
				}
				

			},
			{
				url:"https://res.cloudinary.com/dv9k3us3f/video/upload/v1617712731/b1unsogvg23oxjry7yga.mp4",
				title:"Second",
				_id:"dhdh",
				views:3000,
				description:"A video upload example.Type of video is Romantic...This video should fall under romantic category",
				createdAt:1620642919108,
				visibility:"custom",
				likesCount:212,
				dislikesCount:3,
				organiser:{
				   fullname:"kanhaiya kumar",
				   _id:"11",
				   username:"kk2000",
				   subscribers:["A","B","C"]//just have to take its length...
				}				

			},

		],

		savedVideos:[
			{
				Videoid:{
				url:"https://res.cloudinary.com/dv9k3us3f/video/upload/v1618315460/drvy5kbnabydzmgkg9oe.mp4",
				title:"First",
				description:"A video upload example.This fat man is laughing too hard and in an amazing way",				
				_id:"11",
				views:3000,
				visibility:"custom",
				likesCount:212,
				dislikesCount:3,
				},
				_id:"shs",
				createdAt:1620642919208,
				userid:{
				   fullname:"kanhaiya kumar",
				   _id:"11",
				   avatar:"https://kkleap.github.io/assets/default.jpg",
				   username:"kk2000",
				   subscribers:["A","B","C"]//just have to take its length...
				}			

			},
			{
				Videoid:{
				url:"https://res.cloudinary.com/dv9k3us3f/video/upload/v1618315460/drvy5kbnabydzmgkg9oe.mp4",
				title:"First",
				description:"A video upload example.This fat man is laughing too hard and in an amazing way",				
				_id:"11",
				views:3000,
				visibility:"public",
				likesCount:212,
				dislikesCount:3,
				},
				_id:"shs2",
				createdAt:1620642919208,
				userid:{
				   fullname:"kanhaiya kumar",
				   _id:"11",
				   avatar:"https://kkleap.github.io/assets/default.jpg",
				   username:"kk2000",
				   subscribers:["A","B","C"]//just have to take its length...
				}			

			},
			{
				Videoid:{
				url:"https://res.cloudinary.com/dv9k3us3f/video/upload/v1618315460/drvy5kbnabydzmgkg9oe.mp4",
				title:"First",
				views:3000,
				description:"A video upload example.This fat man is laughing too hard and in an amazing way",				
				_id:"11",
				visibility:"sub-only",
				likesCount:212,
				dislikesCount:3,
				},
				createdAt:1620642919208,
				_id:"shs1",
				userid:{
				   fullname:"kanhaiya kumar",
				   _id:"11",
				   avatar:"https://kkleap.github.io/assets/default.jpg",
				   username:"kk2000",
				   subscribers:["A","B","C"]//just have to take its length...
				}			

			},

		],
		likedvideos:[
			{
				Videoid:{
				url:"https://res.cloudinary.com/dv9k3us3f/video/upload/v1618315460/drvy5kbnabydzmgkg9oe.mp4",
				title:"First",
				views:3000,
				description:"A video upload example.This fat man is laughing too hard and in an amazing way",				
				_id:"11",
				visibility:"custom",
				likesCount:212,
				dislikesCount:3,
				},
				createdAt:1620642919208,
				_id:"shs",
				userid:{
				   fullname:"kanhaiya kumar",
				   _id:"11",
				   avatar:"https://kkleap.github.io/assets/default.jpg",
				   username:"kk2000",
				   subscribers:["A","B","C"]//just have to take its length...
				}			

			},
			{
				Videoid:{
				url:"https://res.cloudinary.com/dv9k3us3f/video/upload/v1618315460/drvy5kbnabydzmgkg9oe.mp4",
				title:"First",
				views:3000,
				description:"A video upload example.This fat man is laughing too hard and in an amazing way",				
				_id:"11",
				visibility:"public",
				likesCount:212,
				dislikesCount:3,
				},
				createdAt:1620642919208,
				_id:"shs2",
				userid:{
				   fullname:"kanhaiya kumar",
				   _id:"11",
				   avatar:"https://kkleap.github.io/assets/default.jpg",
				   username:"kk2000",
				   subscribers:["A","B","C"]//just have to take its length...
				}			

			},
			{
				Videoid:{
				url:"https://res.cloudinary.com/dv9k3us3f/video/upload/v1618315460/drvy5kbnabydzmgkg9oe.mp4",
				title:"First",
				views:3000,
				description:"A video upload example.This fat man is laughing too hard and in an amazing way",				
				_id:"11",
				visibility:"sub-only",
				likesCount:212,
				dislikesCount:3,
				},
				createdAt:1620642919208,
				_id:"shs1",
				userid:{
				   fullname:"kanhaiya kumar",
				   _id:"11",
				   avatar:"https://kkleap.github.io/assets/default.jpg",
				   username:"kk2000",
				   subscribers:["A","B","C"]//just have to take its length...
				}			

			},

		]
	}

	return data;
}

