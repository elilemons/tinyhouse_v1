/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { IResolvers } from 'apollo-server-express';
import { ObjectId } from 'mongodb';
import { Database, Listing } from '../../../lib';

export const listingResolvers: IResolvers = {
  Query: {
    listings: async (
      _root: undefined,
      // eslint-disable-next-line @typescript-eslint/ban-types
      _args: {},
      { db }: { db: Database }
    ): Promise<Listing[]> => {
      return await db.listings.find({}).toArray();
    },
    favorites: async (
      _root: undefined,
      // eslint-disable-next-line @typescript-eslint/ban-types
      _args: {},
      { db }: { db: Database }
    ): Promise<Listing[]> => {
      return await db.listings.find({ favorite: true }).toArray();
    }
  },
  Mutation: {
    deleteListing: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<Listing> => {
      const deleteResult = await db.listings.findOneAndDelete({
        _id: new ObjectId(id),
      });

      if (!deleteResult.value) {
        throw new Error('Failed to delete');
      }

      return deleteResult.value;
    },
    favoriteListing: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<number> => {
      const favoriteResult = await db.listings.updateOne(
        { _id: new ObjectId(id) },
        { $set: { favorite: true }}
      );

      if (!favoriteResult.result.ok) {
        throw new Error('Favoriting failed');
      }
      console.log('Favoriting succeeded', { favoriteResult });

      return favoriteResult.result.ok;
    },

    unfavoriteListing: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<Listing> => {
      const unfavoriteResult = await db.listings.findOneAndUpdate(
        { id: id },
        { $set: { favorite: false } }
      );

      if (!unfavoriteResult.value) {
        throw new Error('Favoriting failed');
      }
      return unfavoriteResult.value;
    },
  },
  Listing: {
    id: (listing: Listing): string => listing._id.toString(),
  },
};
