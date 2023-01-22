import {Entity} from '../entity/entity';
import {SpatialEntity} from './spatial-entity';
import {Game} from '../game/game';

class GameView {
  visibleEntities = new Entity();

  update(game: Game, entity: SpatialEntity) {
    const space = game.spaces.get(entity.spaceId);
  }
}
