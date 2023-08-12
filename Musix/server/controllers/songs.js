import likedSong from "../models/likedSongModel.js";
import userPlayList from "../models/playListModel.js";
import recentlyPlayed from "../models/RecentlyPlayedSongModel.js";
import User from "../models/userModel.js";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

export const addLiked = async (req, res) => {
  const { songId, singerName, songName, songSrc, songImgSrc } = req.body;
  try {
    const id = req.userId;
    const existingUser = await likedSong.findOne({ userId: id });
    if (existingUser) {
      let arr = existingUser.songs;
      arr.unshift({ songId, singerName, songName, songSrc, songImgSrc });
      await likedSong.updateOne({ userId: id }, { $set: { songs: arr } });
      res.status(200).json({ message: "Added to the liked song." });
    } else {
      let arr = [];
      arr.unshift({ songId, singerName, songName, songSrc, songImgSrc });
      const result = await likedSong.create({ userId: id, songs: arr });
      res.status(201).json({ message: "Added to the liked song." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error! Try Again!!" });
  }
};

export const removeLiked = async (req, res) => {
  const { songId } = req.body;
  try {
    const id = req.userId;
    const existingUser = await likedSong.findOne({ userId: id });
    if (existingUser) {
      let arr = existingUser.songs;
      arr.forEach((item, index) => {
        if (item.songId === songId) {
          arr.splice(index, 1);
        }
      });
      await likedSong.updateOne({ userId: id }, { $set: { songs: arr } });
      res
        .status(200)
        .json({ message: "Song removed successfully.", status: true });
    } else {
      res.status(404).json({ message: "Song not removed.", status: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error! Try Again!!" });
  }
};

export const checkLiked = async (req, res) => {
  const { songId } = req.body;
  try {
    const id = req.userId;
    const likedSongUser = await likedSong.findOne({ userId: id });
    if (likedSongUser) {
      const arr = likedSongUser.songs;
      var bool = 0;
      arr.forEach((item, index) => {
        if (item.songId === songId) {
          bool = 1;
        }
      });
      if (bool === 1) res.status(200).json({ message: true });
      else res.status(200).json({ message: false });
    } else {
      res.status(200).json({ message: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error! Try Again!!" });
  }
};

export const getLikedSong = async (req, res) => {
  try {
    const id = req.userId;
    const result = await likedSong.findOne({ userId: id });
    if(result) res.status(200).json({ data: result.songs });
    else res.status(404).json({message : "No Likedsong found."});
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error! Try Again!!" });
  }
};

export const createPlayList = async (req, res) => {
  const { playlistname } = req.body;
  try {
    const id = req.userId;
    const existingUser = await userPlayList.findOne({ userId: id });
    if (existingUser) {
      let arr = existingUser.playList;
      let flag = 0;
      arr.forEach((ele) => {
        if (ele.playListName === playlistname) flag = 1;
      });
      if (flag === 1)
        return res
          .status(400)
          .json({ message: "Playlist name already exists." });
      const newId = uuidv4();
      let newObj = {
        playListId: newId,
        playListName: playlistname,
        songs: [],
      };
      arr.unshift(newObj);
      await userPlayList.updateOne({ userId: id }, { $set: { playList: arr } });
      const result = await userPlayList.findOne({ userId: id });
      res.status(201).json({ result, message: "New PlayList Created." });
    } else {
      const newId = uuidv4();
      let arr = [
        {
          playListId: newId,
          playListName: playlistname,
          songs: [],
        },
      ];
      const result = await userPlayList.create({ userId: id, playList: arr });
      res.status(201).json({ result, message: "New PlayList Created." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error! Try Again!!" });
  }
};

export const deletePlayList = async (req, res) => {
  const { playListId } = req.body;
  try {
    const id = req.userId;
    const existingUser = await userPlayList.findOne({ userId: id });
    if (existingUser) {
      let arr = existingUser.playList;
      arr.forEach((ele, index) => {
        if (ele.playListId === playListId) {
          arr.splice(index, 1);
        }
      });
      await userPlayList.updateOne({ userId: id }, { $set: { playList: arr } });
      res.status(200).json({ message: "PlayList Deleted Successfully." });
    } else {
      res.status(400).json({ message: "PlayList Not Exists." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error! Try Again!!" });
  }
};

export const updatePlayList = async (req, res) => {
  const { playListName, songId, singerName, songName, songSrc, songImgSrc } =
    req.body;
  try {
    const id = req.userId;
    const existingUser = await userPlayList.findOne({ userId: id });
    if (existingUser) {
      let bool = 1;
      let arr = existingUser.playList;
      arr.forEach((ele) => {
        if (ele.playListName === playListName) {
          let song = ele.songs;
          let flag = 1;
          song.forEach((obj) => {
            if (obj.songId === songId) flag = 0;
          });
          if (flag === 1) {
            song.unshift({ songId, singerName, songName, songSrc, songImgSrc });
            bool = 0;
          }
        }
      });
      if (bool === 1)
        return res.status(404).json({ message: `Song is already in the playlist ${playListName}.` });
      await userPlayList.updateOne({ userId: id }, { $set: { playList: arr } });
      const result = await userPlayList.findOne({ userId: id });
      res
        .status(200)
        .json({ result, message: `Added to the playlist ${playListName}.` });
    } else {
      res.status(400).json({ message: "PlayList Not Exists." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error! Try Again!!" });
  }
};

export const getPlayList = async (req, res) => {
  try {
    const id = req.userId;
    const result = await userPlayList.findOne({ userId: id });
    if(result) res.status(200).json({ data: result.playList });
    else res.status(404).json({message:"No PlayList Found."});
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error! Try Again!!" });
  }
};

export const getPlayListById = async (req, res) => {
  const { playListId } = req.body;
  try {
    const id = req.userId;
    const result = await userPlayList.findOne({ userId: id });
    const playList = result.playList;
    let songs = [];
    playList.forEach((ele) => {
      if (ele.playListId === playListId) {
        songs = ele.songs;
      }
    });
    res.status(200).json({ data: songs });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error! Try Again!!" });
  }
};

export const removeSongFromPlayList = async (req, res) => {
  const { playListId, songId } = req.body;
  try {
    const id = req.userId;
    const result = await userPlayList.findOne({ userId: id });
    let playList = result.playList;
    let song = [];
    let flag = 0;
    playList.forEach((ele) => {
      if (ele.playListId === playListId) {
        song = ele.songs;
        flag = 1;
      }
    });
    if (flag === 0)
      return res.status(403).json({ message: "Request Forbidden." });
    flag = 0;
    song.forEach((obj, index) => {
      if (obj.songId === songId) {
        song.splice(index, 1);
        flag = 1;
      }
    });
    if (flag === 0)
      return res.status(403).json({ message: "Request Forbidden." });
    playList.forEach((ele) => {
      if (ele.playListId === playListId) ele.songs = song;
    });
    await userPlayList.updateOne({ userId: id }, { $set: { playList } });
    res.status(200).json({ status: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error! Try Again!!" });
  }
};

export const addToRecentlyPlayedSongs = async (req, res) => {
  const { songId, singerName, songName, songSrc, songImgSrc } = req.body;
  try {
    if(songId===null || songId==="null" || songSrc===null || songSrc==="null") return res.status(403).json({message:"Request forbidden."});
    const id = req.userId;
    const existingUser = await recentlyPlayed.findOne({ userId: id });
    if (existingUser) {
      let arr = existingUser.songs;
      arr.forEach((ele,index)=>{
        if(ele.songId===songId) arr.splice(index,1);
      });
      arr.unshift({ songId , singerName, songName, songSrc, songImgSrc });
      if (arr.length > 21) arr.splice(21, 1);
      await recentlyPlayed.updateOne({ userId: id }, { $set: { songs: arr } });
      await User.updateOne({_id :id},{$set : {lastPlayedSong : arr[0]}});
      const result = await recentlyPlayed.findOne({ userId: id });
      res.status(200).json({ result, message: "Song added to recently played list." });
    } else {
      let arr = [{ songId, singerName, songName, songSrc, songImgSrc }];
      const result = await recentlyPlayed.create({ userId: id, songs: arr });
      await User.updateOne({_id :id},{$set : {lastPlayedSong : arr[0]}});
      res.status(201).json({ result, message: "Song added to recently played list." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error! Try Again!!" });
  }
};

export const getRecentlyPlayedSongs = async (req, res) => {
  try {
    const id = req.userId;
    const result = await recentlyPlayed.findOne({ userId: id });
    if(result) res.status(200).json({ data : result.songs });
    else res.status(404).json({message : "No songs played recenetly"});
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error! Try Again!!" });
  }
};