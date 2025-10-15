
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model avis
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 */
export type avis = $Result.DefaultSelection<Prisma.$avisPayload>
/**
 * Model disponibilites
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 */
export type disponibilites = $Result.DefaultSelection<Prisma.$disponibilitesPayload>
/**
 * Model heurescumul_es
 * 
 */
export type heurescumul_es = $Result.DefaultSelection<Prisma.$heurescumul_esPayload>
/**
 * Model jardin
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 */
export type jardin = $Result.DefaultSelection<Prisma.$jardinPayload>
/**
 * Model messagerie
 * 
 */
export type messagerie = $Result.DefaultSelection<Prisma.$messageriePayload>
/**
 * Model reservation
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 */
export type reservation = $Result.DefaultSelection<Prisma.$reservationPayload>
/**
 * Model utilisateur
 * This table contains check constraints and requires additional setup for migrations. Visit https://pris.ly/d/check-constraints for more info.
 */
export type utilisateur = $Result.DefaultSelection<Prisma.$utilisateurPayload>
/**
 * Model competence
 * 
 */
export type competence = $Result.DefaultSelection<Prisma.$competencePayload>
/**
 * Model utilisateurCompetence
 * 
 */
export type utilisateurCompetence = $Result.DefaultSelection<Prisma.$utilisateurCompetencePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Avis
 * const avis = await prisma.avis.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Avis
   * const avis = await prisma.avis.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.avis`: Exposes CRUD operations for the **avis** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Avis
    * const avis = await prisma.avis.findMany()
    * ```
    */
  get avis(): Prisma.avisDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.disponibilites`: Exposes CRUD operations for the **disponibilites** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Disponibilites
    * const disponibilites = await prisma.disponibilites.findMany()
    * ```
    */
  get disponibilites(): Prisma.disponibilitesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.heurescumul_es`: Exposes CRUD operations for the **heurescumul_es** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Heurescumul_es
    * const heurescumul_es = await prisma.heurescumul_es.findMany()
    * ```
    */
  get heurescumul_es(): Prisma.heurescumul_esDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.jardin`: Exposes CRUD operations for the **jardin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Jardins
    * const jardins = await prisma.jardin.findMany()
    * ```
    */
  get jardin(): Prisma.jardinDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.messagerie`: Exposes CRUD operations for the **messagerie** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messageries
    * const messageries = await prisma.messagerie.findMany()
    * ```
    */
  get messagerie(): Prisma.messagerieDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.reservation`: Exposes CRUD operations for the **reservation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reservations
    * const reservations = await prisma.reservation.findMany()
    * ```
    */
  get reservation(): Prisma.reservationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.utilisateur`: Exposes CRUD operations for the **utilisateur** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Utilisateurs
    * const utilisateurs = await prisma.utilisateur.findMany()
    * ```
    */
  get utilisateur(): Prisma.utilisateurDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.competence`: Exposes CRUD operations for the **competence** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Competences
    * const competences = await prisma.competence.findMany()
    * ```
    */
  get competence(): Prisma.competenceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.utilisateurCompetence`: Exposes CRUD operations for the **utilisateurCompetence** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UtilisateurCompetences
    * const utilisateurCompetences = await prisma.utilisateurCompetence.findMany()
    * ```
    */
  get utilisateurCompetence(): Prisma.utilisateurCompetenceDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.16.2
   * Query Engine version: 1c57fdcd7e44b29b9313256c76699e91c3ac3c43
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    avis: 'avis',
    disponibilites: 'disponibilites',
    heurescumul_es: 'heurescumul_es',
    jardin: 'jardin',
    messagerie: 'messagerie',
    reservation: 'reservation',
    utilisateur: 'utilisateur',
    competence: 'competence',
    utilisateurCompetence: 'utilisateurCompetence'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "avis" | "disponibilites" | "heurescumul_es" | "jardin" | "messagerie" | "reservation" | "utilisateur" | "competence" | "utilisateurCompetence"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      avis: {
        payload: Prisma.$avisPayload<ExtArgs>
        fields: Prisma.avisFieldRefs
        operations: {
          findUnique: {
            args: Prisma.avisFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$avisPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.avisFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$avisPayload>
          }
          findFirst: {
            args: Prisma.avisFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$avisPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.avisFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$avisPayload>
          }
          findMany: {
            args: Prisma.avisFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$avisPayload>[]
          }
          create: {
            args: Prisma.avisCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$avisPayload>
          }
          createMany: {
            args: Prisma.avisCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.avisCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$avisPayload>[]
          }
          delete: {
            args: Prisma.avisDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$avisPayload>
          }
          update: {
            args: Prisma.avisUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$avisPayload>
          }
          deleteMany: {
            args: Prisma.avisDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.avisUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.avisUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$avisPayload>[]
          }
          upsert: {
            args: Prisma.avisUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$avisPayload>
          }
          aggregate: {
            args: Prisma.AvisAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAvis>
          }
          groupBy: {
            args: Prisma.avisGroupByArgs<ExtArgs>
            result: $Utils.Optional<AvisGroupByOutputType>[]
          }
          count: {
            args: Prisma.avisCountArgs<ExtArgs>
            result: $Utils.Optional<AvisCountAggregateOutputType> | number
          }
        }
      }
      disponibilites: {
        payload: Prisma.$disponibilitesPayload<ExtArgs>
        fields: Prisma.disponibilitesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.disponibilitesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$disponibilitesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.disponibilitesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$disponibilitesPayload>
          }
          findFirst: {
            args: Prisma.disponibilitesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$disponibilitesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.disponibilitesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$disponibilitesPayload>
          }
          findMany: {
            args: Prisma.disponibilitesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$disponibilitesPayload>[]
          }
          create: {
            args: Prisma.disponibilitesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$disponibilitesPayload>
          }
          createMany: {
            args: Prisma.disponibilitesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.disponibilitesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$disponibilitesPayload>[]
          }
          delete: {
            args: Prisma.disponibilitesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$disponibilitesPayload>
          }
          update: {
            args: Prisma.disponibilitesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$disponibilitesPayload>
          }
          deleteMany: {
            args: Prisma.disponibilitesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.disponibilitesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.disponibilitesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$disponibilitesPayload>[]
          }
          upsert: {
            args: Prisma.disponibilitesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$disponibilitesPayload>
          }
          aggregate: {
            args: Prisma.DisponibilitesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDisponibilites>
          }
          groupBy: {
            args: Prisma.disponibilitesGroupByArgs<ExtArgs>
            result: $Utils.Optional<DisponibilitesGroupByOutputType>[]
          }
          count: {
            args: Prisma.disponibilitesCountArgs<ExtArgs>
            result: $Utils.Optional<DisponibilitesCountAggregateOutputType> | number
          }
        }
      }
      heurescumul_es: {
        payload: Prisma.$heurescumul_esPayload<ExtArgs>
        fields: Prisma.heurescumul_esFieldRefs
        operations: {
          findUnique: {
            args: Prisma.heurescumul_esFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$heurescumul_esPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.heurescumul_esFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$heurescumul_esPayload>
          }
          findFirst: {
            args: Prisma.heurescumul_esFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$heurescumul_esPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.heurescumul_esFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$heurescumul_esPayload>
          }
          findMany: {
            args: Prisma.heurescumul_esFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$heurescumul_esPayload>[]
          }
          create: {
            args: Prisma.heurescumul_esCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$heurescumul_esPayload>
          }
          createMany: {
            args: Prisma.heurescumul_esCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.heurescumul_esCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$heurescumul_esPayload>[]
          }
          delete: {
            args: Prisma.heurescumul_esDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$heurescumul_esPayload>
          }
          update: {
            args: Prisma.heurescumul_esUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$heurescumul_esPayload>
          }
          deleteMany: {
            args: Prisma.heurescumul_esDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.heurescumul_esUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.heurescumul_esUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$heurescumul_esPayload>[]
          }
          upsert: {
            args: Prisma.heurescumul_esUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$heurescumul_esPayload>
          }
          aggregate: {
            args: Prisma.Heurescumul_esAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHeurescumul_es>
          }
          groupBy: {
            args: Prisma.heurescumul_esGroupByArgs<ExtArgs>
            result: $Utils.Optional<Heurescumul_esGroupByOutputType>[]
          }
          count: {
            args: Prisma.heurescumul_esCountArgs<ExtArgs>
            result: $Utils.Optional<Heurescumul_esCountAggregateOutputType> | number
          }
        }
      }
      jardin: {
        payload: Prisma.$jardinPayload<ExtArgs>
        fields: Prisma.jardinFieldRefs
        operations: {
          findUnique: {
            args: Prisma.jardinFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jardinPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.jardinFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jardinPayload>
          }
          findFirst: {
            args: Prisma.jardinFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jardinPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.jardinFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jardinPayload>
          }
          findMany: {
            args: Prisma.jardinFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jardinPayload>[]
          }
          create: {
            args: Prisma.jardinCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jardinPayload>
          }
          createMany: {
            args: Prisma.jardinCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.jardinCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jardinPayload>[]
          }
          delete: {
            args: Prisma.jardinDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jardinPayload>
          }
          update: {
            args: Prisma.jardinUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jardinPayload>
          }
          deleteMany: {
            args: Prisma.jardinDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.jardinUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.jardinUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jardinPayload>[]
          }
          upsert: {
            args: Prisma.jardinUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$jardinPayload>
          }
          aggregate: {
            args: Prisma.JardinAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJardin>
          }
          groupBy: {
            args: Prisma.jardinGroupByArgs<ExtArgs>
            result: $Utils.Optional<JardinGroupByOutputType>[]
          }
          count: {
            args: Prisma.jardinCountArgs<ExtArgs>
            result: $Utils.Optional<JardinCountAggregateOutputType> | number
          }
        }
      }
      messagerie: {
        payload: Prisma.$messageriePayload<ExtArgs>
        fields: Prisma.messagerieFieldRefs
        operations: {
          findUnique: {
            args: Prisma.messagerieFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messageriePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.messagerieFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messageriePayload>
          }
          findFirst: {
            args: Prisma.messagerieFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messageriePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.messagerieFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messageriePayload>
          }
          findMany: {
            args: Prisma.messagerieFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messageriePayload>[]
          }
          create: {
            args: Prisma.messagerieCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messageriePayload>
          }
          createMany: {
            args: Prisma.messagerieCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.messagerieCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messageriePayload>[]
          }
          delete: {
            args: Prisma.messagerieDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messageriePayload>
          }
          update: {
            args: Prisma.messagerieUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messageriePayload>
          }
          deleteMany: {
            args: Prisma.messagerieDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.messagerieUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.messagerieUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messageriePayload>[]
          }
          upsert: {
            args: Prisma.messagerieUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messageriePayload>
          }
          aggregate: {
            args: Prisma.MessagerieAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessagerie>
          }
          groupBy: {
            args: Prisma.messagerieGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessagerieGroupByOutputType>[]
          }
          count: {
            args: Prisma.messagerieCountArgs<ExtArgs>
            result: $Utils.Optional<MessagerieCountAggregateOutputType> | number
          }
        }
      }
      reservation: {
        payload: Prisma.$reservationPayload<ExtArgs>
        fields: Prisma.reservationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.reservationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reservationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.reservationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reservationPayload>
          }
          findFirst: {
            args: Prisma.reservationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reservationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.reservationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reservationPayload>
          }
          findMany: {
            args: Prisma.reservationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reservationPayload>[]
          }
          create: {
            args: Prisma.reservationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reservationPayload>
          }
          createMany: {
            args: Prisma.reservationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.reservationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reservationPayload>[]
          }
          delete: {
            args: Prisma.reservationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reservationPayload>
          }
          update: {
            args: Prisma.reservationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reservationPayload>
          }
          deleteMany: {
            args: Prisma.reservationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.reservationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.reservationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reservationPayload>[]
          }
          upsert: {
            args: Prisma.reservationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reservationPayload>
          }
          aggregate: {
            args: Prisma.ReservationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReservation>
          }
          groupBy: {
            args: Prisma.reservationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReservationGroupByOutputType>[]
          }
          count: {
            args: Prisma.reservationCountArgs<ExtArgs>
            result: $Utils.Optional<ReservationCountAggregateOutputType> | number
          }
        }
      }
      utilisateur: {
        payload: Prisma.$utilisateurPayload<ExtArgs>
        fields: Prisma.utilisateurFieldRefs
        operations: {
          findUnique: {
            args: Prisma.utilisateurFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.utilisateurFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurPayload>
          }
          findFirst: {
            args: Prisma.utilisateurFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.utilisateurFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurPayload>
          }
          findMany: {
            args: Prisma.utilisateurFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurPayload>[]
          }
          create: {
            args: Prisma.utilisateurCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurPayload>
          }
          createMany: {
            args: Prisma.utilisateurCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.utilisateurCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurPayload>[]
          }
          delete: {
            args: Prisma.utilisateurDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurPayload>
          }
          update: {
            args: Prisma.utilisateurUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurPayload>
          }
          deleteMany: {
            args: Prisma.utilisateurDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.utilisateurUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.utilisateurUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurPayload>[]
          }
          upsert: {
            args: Prisma.utilisateurUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurPayload>
          }
          aggregate: {
            args: Prisma.UtilisateurAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUtilisateur>
          }
          groupBy: {
            args: Prisma.utilisateurGroupByArgs<ExtArgs>
            result: $Utils.Optional<UtilisateurGroupByOutputType>[]
          }
          count: {
            args: Prisma.utilisateurCountArgs<ExtArgs>
            result: $Utils.Optional<UtilisateurCountAggregateOutputType> | number
          }
        }
      }
      competence: {
        payload: Prisma.$competencePayload<ExtArgs>
        fields: Prisma.competenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.competenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.competenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competencePayload>
          }
          findFirst: {
            args: Prisma.competenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.competenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competencePayload>
          }
          findMany: {
            args: Prisma.competenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competencePayload>[]
          }
          create: {
            args: Prisma.competenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competencePayload>
          }
          createMany: {
            args: Prisma.competenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.competenceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competencePayload>[]
          }
          delete: {
            args: Prisma.competenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competencePayload>
          }
          update: {
            args: Prisma.competenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competencePayload>
          }
          deleteMany: {
            args: Prisma.competenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.competenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.competenceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competencePayload>[]
          }
          upsert: {
            args: Prisma.competenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competencePayload>
          }
          aggregate: {
            args: Prisma.CompetenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompetence>
          }
          groupBy: {
            args: Prisma.competenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompetenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.competenceCountArgs<ExtArgs>
            result: $Utils.Optional<CompetenceCountAggregateOutputType> | number
          }
        }
      }
      utilisateurCompetence: {
        payload: Prisma.$utilisateurCompetencePayload<ExtArgs>
        fields: Prisma.utilisateurCompetenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.utilisateurCompetenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurCompetencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.utilisateurCompetenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurCompetencePayload>
          }
          findFirst: {
            args: Prisma.utilisateurCompetenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurCompetencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.utilisateurCompetenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurCompetencePayload>
          }
          findMany: {
            args: Prisma.utilisateurCompetenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurCompetencePayload>[]
          }
          create: {
            args: Prisma.utilisateurCompetenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurCompetencePayload>
          }
          createMany: {
            args: Prisma.utilisateurCompetenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.utilisateurCompetenceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurCompetencePayload>[]
          }
          delete: {
            args: Prisma.utilisateurCompetenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurCompetencePayload>
          }
          update: {
            args: Prisma.utilisateurCompetenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurCompetencePayload>
          }
          deleteMany: {
            args: Prisma.utilisateurCompetenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.utilisateurCompetenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.utilisateurCompetenceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurCompetencePayload>[]
          }
          upsert: {
            args: Prisma.utilisateurCompetenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$utilisateurCompetencePayload>
          }
          aggregate: {
            args: Prisma.UtilisateurCompetenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUtilisateurCompetence>
          }
          groupBy: {
            args: Prisma.utilisateurCompetenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<UtilisateurCompetenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.utilisateurCompetenceCountArgs<ExtArgs>
            result: $Utils.Optional<UtilisateurCompetenceCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    avis?: avisOmit
    disponibilites?: disponibilitesOmit
    heurescumul_es?: heurescumul_esOmit
    jardin?: jardinOmit
    messagerie?: messagerieOmit
    reservation?: reservationOmit
    utilisateur?: utilisateurOmit
    competence?: competenceOmit
    utilisateurCompetence?: utilisateurCompetenceOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type DisponibilitesCountOutputType
   */

  export type DisponibilitesCountOutputType = {
    reservation: number
  }

  export type DisponibilitesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservation?: boolean | DisponibilitesCountOutputTypeCountReservationArgs
  }

  // Custom InputTypes
  /**
   * DisponibilitesCountOutputType without action
   */
  export type DisponibilitesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DisponibilitesCountOutputType
     */
    select?: DisponibilitesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DisponibilitesCountOutputType without action
   */
  export type DisponibilitesCountOutputTypeCountReservationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: reservationWhereInput
  }


  /**
   * Count Type JardinCountOutputType
   */

  export type JardinCountOutputType = {
    avis: number
    disponibilites: number
    reservation: number
  }

  export type JardinCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    avis?: boolean | JardinCountOutputTypeCountAvisArgs
    disponibilites?: boolean | JardinCountOutputTypeCountDisponibilitesArgs
    reservation?: boolean | JardinCountOutputTypeCountReservationArgs
  }

  // Custom InputTypes
  /**
   * JardinCountOutputType without action
   */
  export type JardinCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JardinCountOutputType
     */
    select?: JardinCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * JardinCountOutputType without action
   */
  export type JardinCountOutputTypeCountAvisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: avisWhereInput
  }

  /**
   * JardinCountOutputType without action
   */
  export type JardinCountOutputTypeCountDisponibilitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: disponibilitesWhereInput
  }

  /**
   * JardinCountOutputType without action
   */
  export type JardinCountOutputTypeCountReservationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: reservationWhereInput
  }


  /**
   * Count Type UtilisateurCountOutputType
   */

  export type UtilisateurCountOutputType = {
    avis: number
    heurescumul_es: number
    messagerie_messagerie_id_destinataireToutilisateur: number
    messagerie_messagerie_id_envoyeurToutilisateur: number
    reservation: number
    competences: number
  }

  export type UtilisateurCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    avis?: boolean | UtilisateurCountOutputTypeCountAvisArgs
    heurescumul_es?: boolean | UtilisateurCountOutputTypeCountHeurescumul_esArgs
    messagerie_messagerie_id_destinataireToutilisateur?: boolean | UtilisateurCountOutputTypeCountMessagerie_messagerie_id_destinataireToutilisateurArgs
    messagerie_messagerie_id_envoyeurToutilisateur?: boolean | UtilisateurCountOutputTypeCountMessagerie_messagerie_id_envoyeurToutilisateurArgs
    reservation?: boolean | UtilisateurCountOutputTypeCountReservationArgs
    competences?: boolean | UtilisateurCountOutputTypeCountCompetencesArgs
  }

  // Custom InputTypes
  /**
   * UtilisateurCountOutputType without action
   */
  export type UtilisateurCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UtilisateurCountOutputType
     */
    select?: UtilisateurCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UtilisateurCountOutputType without action
   */
  export type UtilisateurCountOutputTypeCountAvisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: avisWhereInput
  }

  /**
   * UtilisateurCountOutputType without action
   */
  export type UtilisateurCountOutputTypeCountHeurescumul_esArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: heurescumul_esWhereInput
  }

  /**
   * UtilisateurCountOutputType without action
   */
  export type UtilisateurCountOutputTypeCountMessagerie_messagerie_id_destinataireToutilisateurArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: messagerieWhereInput
  }

  /**
   * UtilisateurCountOutputType without action
   */
  export type UtilisateurCountOutputTypeCountMessagerie_messagerie_id_envoyeurToutilisateurArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: messagerieWhereInput
  }

  /**
   * UtilisateurCountOutputType without action
   */
  export type UtilisateurCountOutputTypeCountReservationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: reservationWhereInput
  }

  /**
   * UtilisateurCountOutputType without action
   */
  export type UtilisateurCountOutputTypeCountCompetencesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: utilisateurCompetenceWhereInput
  }


  /**
   * Count Type CompetenceCountOutputType
   */

  export type CompetenceCountOutputType = {
    utilisateurs: number
  }

  export type CompetenceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    utilisateurs?: boolean | CompetenceCountOutputTypeCountUtilisateursArgs
  }

  // Custom InputTypes
  /**
   * CompetenceCountOutputType without action
   */
  export type CompetenceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompetenceCountOutputType
     */
    select?: CompetenceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CompetenceCountOutputType without action
   */
  export type CompetenceCountOutputTypeCountUtilisateursArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: utilisateurCompetenceWhereInput
  }


  /**
   * Models
   */

  /**
   * Model avis
   */

  export type AggregateAvis = {
    _count: AvisCountAggregateOutputType | null
    _avg: AvisAvgAggregateOutputType | null
    _sum: AvisSumAggregateOutputType | null
    _min: AvisMinAggregateOutputType | null
    _max: AvisMaxAggregateOutputType | null
  }

  export type AvisAvgAggregateOutputType = {
    id_avis: number | null
    id_utilisateur: number | null
    id_jardin: number | null
    note: number | null
  }

  export type AvisSumAggregateOutputType = {
    id_avis: bigint | null
    id_utilisateur: bigint | null
    id_jardin: bigint | null
    note: number | null
  }

  export type AvisMinAggregateOutputType = {
    id_avis: bigint | null
    id_utilisateur: bigint | null
    id_jardin: bigint | null
    note: number | null
    commentaire: string | null
    date_avis: Date | null
  }

  export type AvisMaxAggregateOutputType = {
    id_avis: bigint | null
    id_utilisateur: bigint | null
    id_jardin: bigint | null
    note: number | null
    commentaire: string | null
    date_avis: Date | null
  }

  export type AvisCountAggregateOutputType = {
    id_avis: number
    id_utilisateur: number
    id_jardin: number
    note: number
    commentaire: number
    date_avis: number
    _all: number
  }


  export type AvisAvgAggregateInputType = {
    id_avis?: true
    id_utilisateur?: true
    id_jardin?: true
    note?: true
  }

  export type AvisSumAggregateInputType = {
    id_avis?: true
    id_utilisateur?: true
    id_jardin?: true
    note?: true
  }

  export type AvisMinAggregateInputType = {
    id_avis?: true
    id_utilisateur?: true
    id_jardin?: true
    note?: true
    commentaire?: true
    date_avis?: true
  }

  export type AvisMaxAggregateInputType = {
    id_avis?: true
    id_utilisateur?: true
    id_jardin?: true
    note?: true
    commentaire?: true
    date_avis?: true
  }

  export type AvisCountAggregateInputType = {
    id_avis?: true
    id_utilisateur?: true
    id_jardin?: true
    note?: true
    commentaire?: true
    date_avis?: true
    _all?: true
  }

  export type AvisAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which avis to aggregate.
     */
    where?: avisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of avis to fetch.
     */
    orderBy?: avisOrderByWithRelationInput | avisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: avisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` avis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` avis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned avis
    **/
    _count?: true | AvisCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AvisAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AvisSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AvisMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AvisMaxAggregateInputType
  }

  export type GetAvisAggregateType<T extends AvisAggregateArgs> = {
        [P in keyof T & keyof AggregateAvis]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAvis[P]>
      : GetScalarType<T[P], AggregateAvis[P]>
  }




  export type avisGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: avisWhereInput
    orderBy?: avisOrderByWithAggregationInput | avisOrderByWithAggregationInput[]
    by: AvisScalarFieldEnum[] | AvisScalarFieldEnum
    having?: avisScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AvisCountAggregateInputType | true
    _avg?: AvisAvgAggregateInputType
    _sum?: AvisSumAggregateInputType
    _min?: AvisMinAggregateInputType
    _max?: AvisMaxAggregateInputType
  }

  export type AvisGroupByOutputType = {
    id_avis: bigint
    id_utilisateur: bigint | null
    id_jardin: bigint | null
    note: number | null
    commentaire: string | null
    date_avis: Date | null
    _count: AvisCountAggregateOutputType | null
    _avg: AvisAvgAggregateOutputType | null
    _sum: AvisSumAggregateOutputType | null
    _min: AvisMinAggregateOutputType | null
    _max: AvisMaxAggregateOutputType | null
  }

  type GetAvisGroupByPayload<T extends avisGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AvisGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AvisGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AvisGroupByOutputType[P]>
            : GetScalarType<T[P], AvisGroupByOutputType[P]>
        }
      >
    >


  export type avisSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_avis?: boolean
    id_utilisateur?: boolean
    id_jardin?: boolean
    note?: boolean
    commentaire?: boolean
    date_avis?: boolean
    jardin?: boolean | avis$jardinArgs<ExtArgs>
    utilisateur?: boolean | avis$utilisateurArgs<ExtArgs>
  }, ExtArgs["result"]["avis"]>

  export type avisSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_avis?: boolean
    id_utilisateur?: boolean
    id_jardin?: boolean
    note?: boolean
    commentaire?: boolean
    date_avis?: boolean
    jardin?: boolean | avis$jardinArgs<ExtArgs>
    utilisateur?: boolean | avis$utilisateurArgs<ExtArgs>
  }, ExtArgs["result"]["avis"]>

  export type avisSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_avis?: boolean
    id_utilisateur?: boolean
    id_jardin?: boolean
    note?: boolean
    commentaire?: boolean
    date_avis?: boolean
    jardin?: boolean | avis$jardinArgs<ExtArgs>
    utilisateur?: boolean | avis$utilisateurArgs<ExtArgs>
  }, ExtArgs["result"]["avis"]>

  export type avisSelectScalar = {
    id_avis?: boolean
    id_utilisateur?: boolean
    id_jardin?: boolean
    note?: boolean
    commentaire?: boolean
    date_avis?: boolean
  }

  export type avisOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id_avis" | "id_utilisateur" | "id_jardin" | "note" | "commentaire" | "date_avis", ExtArgs["result"]["avis"]>
  export type avisInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jardin?: boolean | avis$jardinArgs<ExtArgs>
    utilisateur?: boolean | avis$utilisateurArgs<ExtArgs>
  }
  export type avisIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jardin?: boolean | avis$jardinArgs<ExtArgs>
    utilisateur?: boolean | avis$utilisateurArgs<ExtArgs>
  }
  export type avisIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jardin?: boolean | avis$jardinArgs<ExtArgs>
    utilisateur?: boolean | avis$utilisateurArgs<ExtArgs>
  }

  export type $avisPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "avis"
    objects: {
      jardin: Prisma.$jardinPayload<ExtArgs> | null
      utilisateur: Prisma.$utilisateurPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id_avis: bigint
      id_utilisateur: bigint | null
      id_jardin: bigint | null
      note: number | null
      commentaire: string | null
      date_avis: Date | null
    }, ExtArgs["result"]["avis"]>
    composites: {}
  }

  type avisGetPayload<S extends boolean | null | undefined | avisDefaultArgs> = $Result.GetResult<Prisma.$avisPayload, S>

  type avisCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<avisFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AvisCountAggregateInputType | true
    }

  export interface avisDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['avis'], meta: { name: 'avis' } }
    /**
     * Find zero or one Avis that matches the filter.
     * @param {avisFindUniqueArgs} args - Arguments to find a Avis
     * @example
     * // Get one Avis
     * const avis = await prisma.avis.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends avisFindUniqueArgs>(args: SelectSubset<T, avisFindUniqueArgs<ExtArgs>>): Prisma__avisClient<$Result.GetResult<Prisma.$avisPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Avis that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {avisFindUniqueOrThrowArgs} args - Arguments to find a Avis
     * @example
     * // Get one Avis
     * const avis = await prisma.avis.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends avisFindUniqueOrThrowArgs>(args: SelectSubset<T, avisFindUniqueOrThrowArgs<ExtArgs>>): Prisma__avisClient<$Result.GetResult<Prisma.$avisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Avis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {avisFindFirstArgs} args - Arguments to find a Avis
     * @example
     * // Get one Avis
     * const avis = await prisma.avis.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends avisFindFirstArgs>(args?: SelectSubset<T, avisFindFirstArgs<ExtArgs>>): Prisma__avisClient<$Result.GetResult<Prisma.$avisPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Avis that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {avisFindFirstOrThrowArgs} args - Arguments to find a Avis
     * @example
     * // Get one Avis
     * const avis = await prisma.avis.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends avisFindFirstOrThrowArgs>(args?: SelectSubset<T, avisFindFirstOrThrowArgs<ExtArgs>>): Prisma__avisClient<$Result.GetResult<Prisma.$avisPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Avis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {avisFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Avis
     * const avis = await prisma.avis.findMany()
     * 
     * // Get first 10 Avis
     * const avis = await prisma.avis.findMany({ take: 10 })
     * 
     * // Only select the `id_avis`
     * const avisWithId_avisOnly = await prisma.avis.findMany({ select: { id_avis: true } })
     * 
     */
    findMany<T extends avisFindManyArgs>(args?: SelectSubset<T, avisFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$avisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Avis.
     * @param {avisCreateArgs} args - Arguments to create a Avis.
     * @example
     * // Create one Avis
     * const Avis = await prisma.avis.create({
     *   data: {
     *     // ... data to create a Avis
     *   }
     * })
     * 
     */
    create<T extends avisCreateArgs>(args: SelectSubset<T, avisCreateArgs<ExtArgs>>): Prisma__avisClient<$Result.GetResult<Prisma.$avisPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Avis.
     * @param {avisCreateManyArgs} args - Arguments to create many Avis.
     * @example
     * // Create many Avis
     * const avis = await prisma.avis.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends avisCreateManyArgs>(args?: SelectSubset<T, avisCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Avis and returns the data saved in the database.
     * @param {avisCreateManyAndReturnArgs} args - Arguments to create many Avis.
     * @example
     * // Create many Avis
     * const avis = await prisma.avis.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Avis and only return the `id_avis`
     * const avisWithId_avisOnly = await prisma.avis.createManyAndReturn({
     *   select: { id_avis: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends avisCreateManyAndReturnArgs>(args?: SelectSubset<T, avisCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$avisPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Avis.
     * @param {avisDeleteArgs} args - Arguments to delete one Avis.
     * @example
     * // Delete one Avis
     * const Avis = await prisma.avis.delete({
     *   where: {
     *     // ... filter to delete one Avis
     *   }
     * })
     * 
     */
    delete<T extends avisDeleteArgs>(args: SelectSubset<T, avisDeleteArgs<ExtArgs>>): Prisma__avisClient<$Result.GetResult<Prisma.$avisPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Avis.
     * @param {avisUpdateArgs} args - Arguments to update one Avis.
     * @example
     * // Update one Avis
     * const avis = await prisma.avis.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends avisUpdateArgs>(args: SelectSubset<T, avisUpdateArgs<ExtArgs>>): Prisma__avisClient<$Result.GetResult<Prisma.$avisPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Avis.
     * @param {avisDeleteManyArgs} args - Arguments to filter Avis to delete.
     * @example
     * // Delete a few Avis
     * const { count } = await prisma.avis.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends avisDeleteManyArgs>(args?: SelectSubset<T, avisDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Avis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {avisUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Avis
     * const avis = await prisma.avis.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends avisUpdateManyArgs>(args: SelectSubset<T, avisUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Avis and returns the data updated in the database.
     * @param {avisUpdateManyAndReturnArgs} args - Arguments to update many Avis.
     * @example
     * // Update many Avis
     * const avis = await prisma.avis.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Avis and only return the `id_avis`
     * const avisWithId_avisOnly = await prisma.avis.updateManyAndReturn({
     *   select: { id_avis: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends avisUpdateManyAndReturnArgs>(args: SelectSubset<T, avisUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$avisPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Avis.
     * @param {avisUpsertArgs} args - Arguments to update or create a Avis.
     * @example
     * // Update or create a Avis
     * const avis = await prisma.avis.upsert({
     *   create: {
     *     // ... data to create a Avis
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Avis we want to update
     *   }
     * })
     */
    upsert<T extends avisUpsertArgs>(args: SelectSubset<T, avisUpsertArgs<ExtArgs>>): Prisma__avisClient<$Result.GetResult<Prisma.$avisPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Avis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {avisCountArgs} args - Arguments to filter Avis to count.
     * @example
     * // Count the number of Avis
     * const count = await prisma.avis.count({
     *   where: {
     *     // ... the filter for the Avis we want to count
     *   }
     * })
    **/
    count<T extends avisCountArgs>(
      args?: Subset<T, avisCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AvisCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Avis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvisAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AvisAggregateArgs>(args: Subset<T, AvisAggregateArgs>): Prisma.PrismaPromise<GetAvisAggregateType<T>>

    /**
     * Group by Avis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {avisGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends avisGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: avisGroupByArgs['orderBy'] }
        : { orderBy?: avisGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, avisGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAvisGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the avis model
   */
  readonly fields: avisFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for avis.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__avisClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    jardin<T extends avis$jardinArgs<ExtArgs> = {}>(args?: Subset<T, avis$jardinArgs<ExtArgs>>): Prisma__jardinClient<$Result.GetResult<Prisma.$jardinPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    utilisateur<T extends avis$utilisateurArgs<ExtArgs> = {}>(args?: Subset<T, avis$utilisateurArgs<ExtArgs>>): Prisma__utilisateurClient<$Result.GetResult<Prisma.$utilisateurPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the avis model
   */
  interface avisFieldRefs {
    readonly id_avis: FieldRef<"avis", 'BigInt'>
    readonly id_utilisateur: FieldRef<"avis", 'BigInt'>
    readonly id_jardin: FieldRef<"avis", 'BigInt'>
    readonly note: FieldRef<"avis", 'Int'>
    readonly commentaire: FieldRef<"avis", 'String'>
    readonly date_avis: FieldRef<"avis", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * avis findUnique
   */
  export type avisFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the avis
     */
    select?: avisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the avis
     */
    omit?: avisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: avisInclude<ExtArgs> | null
    /**
     * Filter, which avis to fetch.
     */
    where: avisWhereUniqueInput
  }

  /**
   * avis findUniqueOrThrow
   */
  export type avisFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the avis
     */
    select?: avisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the avis
     */
    omit?: avisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: avisInclude<ExtArgs> | null
    /**
     * Filter, which avis to fetch.
     */
    where: avisWhereUniqueInput
  }

  /**
   * avis findFirst
   */
  export type avisFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the avis
     */
    select?: avisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the avis
     */
    omit?: avisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: avisInclude<ExtArgs> | null
    /**
     * Filter, which avis to fetch.
     */
    where?: avisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of avis to fetch.
     */
    orderBy?: avisOrderByWithRelationInput | avisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for avis.
     */
    cursor?: avisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` avis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` avis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of avis.
     */
    distinct?: AvisScalarFieldEnum | AvisScalarFieldEnum[]
  }

  /**
   * avis findFirstOrThrow
   */
  export type avisFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the avis
     */
    select?: avisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the avis
     */
    omit?: avisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: avisInclude<ExtArgs> | null
    /**
     * Filter, which avis to fetch.
     */
    where?: avisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of avis to fetch.
     */
    orderBy?: avisOrderByWithRelationInput | avisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for avis.
     */
    cursor?: avisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` avis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` avis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of avis.
     */
    distinct?: AvisScalarFieldEnum | AvisScalarFieldEnum[]
  }

  /**
   * avis findMany
   */
  export type avisFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the avis
     */
    select?: avisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the avis
     */
    omit?: avisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: avisInclude<ExtArgs> | null
    /**
     * Filter, which avis to fetch.
     */
    where?: avisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of avis to fetch.
     */
    orderBy?: avisOrderByWithRelationInput | avisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing avis.
     */
    cursor?: avisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` avis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` avis.
     */
    skip?: number
    distinct?: AvisScalarFieldEnum | AvisScalarFieldEnum[]
  }

  /**
   * avis create
   */
  export type avisCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the avis
     */
    select?: avisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the avis
     */
    omit?: avisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: avisInclude<ExtArgs> | null
    /**
     * The data needed to create a avis.
     */
    data?: XOR<avisCreateInput, avisUncheckedCreateInput>
  }

  /**
   * avis createMany
   */
  export type avisCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many avis.
     */
    data: avisCreateManyInput | avisCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * avis createManyAndReturn
   */
  export type avisCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the avis
     */
    select?: avisSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the avis
     */
    omit?: avisOmit<ExtArgs> | null
    /**
     * The data used to create many avis.
     */
    data: avisCreateManyInput | avisCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: avisIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * avis update
   */
  export type avisUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the avis
     */
    select?: avisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the avis
     */
    omit?: avisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: avisInclude<ExtArgs> | null
    /**
     * The data needed to update a avis.
     */
    data: XOR<avisUpdateInput, avisUncheckedUpdateInput>
    /**
     * Choose, which avis to update.
     */
    where: avisWhereUniqueInput
  }

  /**
   * avis updateMany
   */
  export type avisUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update avis.
     */
    data: XOR<avisUpdateManyMutationInput, avisUncheckedUpdateManyInput>
    /**
     * Filter which avis to update
     */
    where?: avisWhereInput
    /**
     * Limit how many avis to update.
     */
    limit?: number
  }

  /**
   * avis updateManyAndReturn
   */
  export type avisUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the avis
     */
    select?: avisSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the avis
     */
    omit?: avisOmit<ExtArgs> | null
    /**
     * The data used to update avis.
     */
    data: XOR<avisUpdateManyMutationInput, avisUncheckedUpdateManyInput>
    /**
     * Filter which avis to update
     */
    where?: avisWhereInput
    /**
     * Limit how many avis to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: avisIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * avis upsert
   */
  export type avisUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the avis
     */
    select?: avisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the avis
     */
    omit?: avisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: avisInclude<ExtArgs> | null
    /**
     * The filter to search for the avis to update in case it exists.
     */
    where: avisWhereUniqueInput
    /**
     * In case the avis found by the `where` argument doesn't exist, create a new avis with this data.
     */
    create: XOR<avisCreateInput, avisUncheckedCreateInput>
    /**
     * In case the avis was found with the provided `where` argument, update it with this data.
     */
    update: XOR<avisUpdateInput, avisUncheckedUpdateInput>
  }

  /**
   * avis delete
   */
  export type avisDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the avis
     */
    select?: avisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the avis
     */
    omit?: avisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: avisInclude<ExtArgs> | null
    /**
     * Filter which avis to delete.
     */
    where: avisWhereUniqueInput
  }

  /**
   * avis deleteMany
   */
  export type avisDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which avis to delete
     */
    where?: avisWhereInput
    /**
     * Limit how many avis to delete.
     */
    limit?: number
  }

  /**
   * avis.jardin
   */
  export type avis$jardinArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jardin
     */
    select?: jardinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jardin
     */
    omit?: jardinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jardinInclude<ExtArgs> | null
    where?: jardinWhereInput
  }

  /**
   * avis.utilisateur
   */
  export type avis$utilisateurArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateur
     */
    select?: utilisateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateur
     */
    omit?: utilisateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurInclude<ExtArgs> | null
    where?: utilisateurWhereInput
  }

  /**
   * avis without action
   */
  export type avisDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the avis
     */
    select?: avisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the avis
     */
    omit?: avisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: avisInclude<ExtArgs> | null
  }


  /**
   * Model disponibilites
   */

  export type AggregateDisponibilites = {
    _count: DisponibilitesCountAggregateOutputType | null
    _avg: DisponibilitesAvgAggregateOutputType | null
    _sum: DisponibilitesSumAggregateOutputType | null
    _min: DisponibilitesMinAggregateOutputType | null
    _max: DisponibilitesMaxAggregateOutputType | null
  }

  export type DisponibilitesAvgAggregateOutputType = {
    id_disponibilite: number | null
    id_jardin: number | null
  }

  export type DisponibilitesSumAggregateOutputType = {
    id_disponibilite: bigint | null
    id_jardin: bigint | null
  }

  export type DisponibilitesMinAggregateOutputType = {
    id_disponibilite: bigint | null
    id_jardin: bigint | null
    date_dispo: Date | null
    heure_debut: Date | null
    heure_fin: Date | null
    statut: string | null
  }

  export type DisponibilitesMaxAggregateOutputType = {
    id_disponibilite: bigint | null
    id_jardin: bigint | null
    date_dispo: Date | null
    heure_debut: Date | null
    heure_fin: Date | null
    statut: string | null
  }

  export type DisponibilitesCountAggregateOutputType = {
    id_disponibilite: number
    id_jardin: number
    date_dispo: number
    heure_debut: number
    heure_fin: number
    statut: number
    _all: number
  }


  export type DisponibilitesAvgAggregateInputType = {
    id_disponibilite?: true
    id_jardin?: true
  }

  export type DisponibilitesSumAggregateInputType = {
    id_disponibilite?: true
    id_jardin?: true
  }

  export type DisponibilitesMinAggregateInputType = {
    id_disponibilite?: true
    id_jardin?: true
    date_dispo?: true
    heure_debut?: true
    heure_fin?: true
    statut?: true
  }

  export type DisponibilitesMaxAggregateInputType = {
    id_disponibilite?: true
    id_jardin?: true
    date_dispo?: true
    heure_debut?: true
    heure_fin?: true
    statut?: true
  }

  export type DisponibilitesCountAggregateInputType = {
    id_disponibilite?: true
    id_jardin?: true
    date_dispo?: true
    heure_debut?: true
    heure_fin?: true
    statut?: true
    _all?: true
  }

  export type DisponibilitesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which disponibilites to aggregate.
     */
    where?: disponibilitesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of disponibilites to fetch.
     */
    orderBy?: disponibilitesOrderByWithRelationInput | disponibilitesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: disponibilitesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` disponibilites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` disponibilites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned disponibilites
    **/
    _count?: true | DisponibilitesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DisponibilitesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DisponibilitesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DisponibilitesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DisponibilitesMaxAggregateInputType
  }

  export type GetDisponibilitesAggregateType<T extends DisponibilitesAggregateArgs> = {
        [P in keyof T & keyof AggregateDisponibilites]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDisponibilites[P]>
      : GetScalarType<T[P], AggregateDisponibilites[P]>
  }




  export type disponibilitesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: disponibilitesWhereInput
    orderBy?: disponibilitesOrderByWithAggregationInput | disponibilitesOrderByWithAggregationInput[]
    by: DisponibilitesScalarFieldEnum[] | DisponibilitesScalarFieldEnum
    having?: disponibilitesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DisponibilitesCountAggregateInputType | true
    _avg?: DisponibilitesAvgAggregateInputType
    _sum?: DisponibilitesSumAggregateInputType
    _min?: DisponibilitesMinAggregateInputType
    _max?: DisponibilitesMaxAggregateInputType
  }

  export type DisponibilitesGroupByOutputType = {
    id_disponibilite: bigint
    id_jardin: bigint | null
    date_dispo: Date | null
    heure_debut: Date | null
    heure_fin: Date | null
    statut: string | null
    _count: DisponibilitesCountAggregateOutputType | null
    _avg: DisponibilitesAvgAggregateOutputType | null
    _sum: DisponibilitesSumAggregateOutputType | null
    _min: DisponibilitesMinAggregateOutputType | null
    _max: DisponibilitesMaxAggregateOutputType | null
  }

  type GetDisponibilitesGroupByPayload<T extends disponibilitesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DisponibilitesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DisponibilitesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DisponibilitesGroupByOutputType[P]>
            : GetScalarType<T[P], DisponibilitesGroupByOutputType[P]>
        }
      >
    >


  export type disponibilitesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_disponibilite?: boolean
    id_jardin?: boolean
    date_dispo?: boolean
    heure_debut?: boolean
    heure_fin?: boolean
    statut?: boolean
    jardin?: boolean | disponibilites$jardinArgs<ExtArgs>
    reservation?: boolean | disponibilites$reservationArgs<ExtArgs>
    _count?: boolean | DisponibilitesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["disponibilites"]>

  export type disponibilitesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_disponibilite?: boolean
    id_jardin?: boolean
    date_dispo?: boolean
    heure_debut?: boolean
    heure_fin?: boolean
    statut?: boolean
    jardin?: boolean | disponibilites$jardinArgs<ExtArgs>
  }, ExtArgs["result"]["disponibilites"]>

  export type disponibilitesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_disponibilite?: boolean
    id_jardin?: boolean
    date_dispo?: boolean
    heure_debut?: boolean
    heure_fin?: boolean
    statut?: boolean
    jardin?: boolean | disponibilites$jardinArgs<ExtArgs>
  }, ExtArgs["result"]["disponibilites"]>

  export type disponibilitesSelectScalar = {
    id_disponibilite?: boolean
    id_jardin?: boolean
    date_dispo?: boolean
    heure_debut?: boolean
    heure_fin?: boolean
    statut?: boolean
  }

  export type disponibilitesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id_disponibilite" | "id_jardin" | "date_dispo" | "heure_debut" | "heure_fin" | "statut", ExtArgs["result"]["disponibilites"]>
  export type disponibilitesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jardin?: boolean | disponibilites$jardinArgs<ExtArgs>
    reservation?: boolean | disponibilites$reservationArgs<ExtArgs>
    _count?: boolean | DisponibilitesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type disponibilitesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jardin?: boolean | disponibilites$jardinArgs<ExtArgs>
  }
  export type disponibilitesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jardin?: boolean | disponibilites$jardinArgs<ExtArgs>
  }

  export type $disponibilitesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "disponibilites"
    objects: {
      jardin: Prisma.$jardinPayload<ExtArgs> | null
      reservation: Prisma.$reservationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id_disponibilite: bigint
      id_jardin: bigint | null
      date_dispo: Date | null
      heure_debut: Date | null
      heure_fin: Date | null
      statut: string | null
    }, ExtArgs["result"]["disponibilites"]>
    composites: {}
  }

  type disponibilitesGetPayload<S extends boolean | null | undefined | disponibilitesDefaultArgs> = $Result.GetResult<Prisma.$disponibilitesPayload, S>

  type disponibilitesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<disponibilitesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DisponibilitesCountAggregateInputType | true
    }

  export interface disponibilitesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['disponibilites'], meta: { name: 'disponibilites' } }
    /**
     * Find zero or one Disponibilites that matches the filter.
     * @param {disponibilitesFindUniqueArgs} args - Arguments to find a Disponibilites
     * @example
     * // Get one Disponibilites
     * const disponibilites = await prisma.disponibilites.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends disponibilitesFindUniqueArgs>(args: SelectSubset<T, disponibilitesFindUniqueArgs<ExtArgs>>): Prisma__disponibilitesClient<$Result.GetResult<Prisma.$disponibilitesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Disponibilites that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {disponibilitesFindUniqueOrThrowArgs} args - Arguments to find a Disponibilites
     * @example
     * // Get one Disponibilites
     * const disponibilites = await prisma.disponibilites.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends disponibilitesFindUniqueOrThrowArgs>(args: SelectSubset<T, disponibilitesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__disponibilitesClient<$Result.GetResult<Prisma.$disponibilitesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Disponibilites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {disponibilitesFindFirstArgs} args - Arguments to find a Disponibilites
     * @example
     * // Get one Disponibilites
     * const disponibilites = await prisma.disponibilites.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends disponibilitesFindFirstArgs>(args?: SelectSubset<T, disponibilitesFindFirstArgs<ExtArgs>>): Prisma__disponibilitesClient<$Result.GetResult<Prisma.$disponibilitesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Disponibilites that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {disponibilitesFindFirstOrThrowArgs} args - Arguments to find a Disponibilites
     * @example
     * // Get one Disponibilites
     * const disponibilites = await prisma.disponibilites.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends disponibilitesFindFirstOrThrowArgs>(args?: SelectSubset<T, disponibilitesFindFirstOrThrowArgs<ExtArgs>>): Prisma__disponibilitesClient<$Result.GetResult<Prisma.$disponibilitesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Disponibilites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {disponibilitesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Disponibilites
     * const disponibilites = await prisma.disponibilites.findMany()
     * 
     * // Get first 10 Disponibilites
     * const disponibilites = await prisma.disponibilites.findMany({ take: 10 })
     * 
     * // Only select the `id_disponibilite`
     * const disponibilitesWithId_disponibiliteOnly = await prisma.disponibilites.findMany({ select: { id_disponibilite: true } })
     * 
     */
    findMany<T extends disponibilitesFindManyArgs>(args?: SelectSubset<T, disponibilitesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$disponibilitesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Disponibilites.
     * @param {disponibilitesCreateArgs} args - Arguments to create a Disponibilites.
     * @example
     * // Create one Disponibilites
     * const Disponibilites = await prisma.disponibilites.create({
     *   data: {
     *     // ... data to create a Disponibilites
     *   }
     * })
     * 
     */
    create<T extends disponibilitesCreateArgs>(args: SelectSubset<T, disponibilitesCreateArgs<ExtArgs>>): Prisma__disponibilitesClient<$Result.GetResult<Prisma.$disponibilitesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Disponibilites.
     * @param {disponibilitesCreateManyArgs} args - Arguments to create many Disponibilites.
     * @example
     * // Create many Disponibilites
     * const disponibilites = await prisma.disponibilites.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends disponibilitesCreateManyArgs>(args?: SelectSubset<T, disponibilitesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Disponibilites and returns the data saved in the database.
     * @param {disponibilitesCreateManyAndReturnArgs} args - Arguments to create many Disponibilites.
     * @example
     * // Create many Disponibilites
     * const disponibilites = await prisma.disponibilites.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Disponibilites and only return the `id_disponibilite`
     * const disponibilitesWithId_disponibiliteOnly = await prisma.disponibilites.createManyAndReturn({
     *   select: { id_disponibilite: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends disponibilitesCreateManyAndReturnArgs>(args?: SelectSubset<T, disponibilitesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$disponibilitesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Disponibilites.
     * @param {disponibilitesDeleteArgs} args - Arguments to delete one Disponibilites.
     * @example
     * // Delete one Disponibilites
     * const Disponibilites = await prisma.disponibilites.delete({
     *   where: {
     *     // ... filter to delete one Disponibilites
     *   }
     * })
     * 
     */
    delete<T extends disponibilitesDeleteArgs>(args: SelectSubset<T, disponibilitesDeleteArgs<ExtArgs>>): Prisma__disponibilitesClient<$Result.GetResult<Prisma.$disponibilitesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Disponibilites.
     * @param {disponibilitesUpdateArgs} args - Arguments to update one Disponibilites.
     * @example
     * // Update one Disponibilites
     * const disponibilites = await prisma.disponibilites.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends disponibilitesUpdateArgs>(args: SelectSubset<T, disponibilitesUpdateArgs<ExtArgs>>): Prisma__disponibilitesClient<$Result.GetResult<Prisma.$disponibilitesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Disponibilites.
     * @param {disponibilitesDeleteManyArgs} args - Arguments to filter Disponibilites to delete.
     * @example
     * // Delete a few Disponibilites
     * const { count } = await prisma.disponibilites.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends disponibilitesDeleteManyArgs>(args?: SelectSubset<T, disponibilitesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Disponibilites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {disponibilitesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Disponibilites
     * const disponibilites = await prisma.disponibilites.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends disponibilitesUpdateManyArgs>(args: SelectSubset<T, disponibilitesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Disponibilites and returns the data updated in the database.
     * @param {disponibilitesUpdateManyAndReturnArgs} args - Arguments to update many Disponibilites.
     * @example
     * // Update many Disponibilites
     * const disponibilites = await prisma.disponibilites.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Disponibilites and only return the `id_disponibilite`
     * const disponibilitesWithId_disponibiliteOnly = await prisma.disponibilites.updateManyAndReturn({
     *   select: { id_disponibilite: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends disponibilitesUpdateManyAndReturnArgs>(args: SelectSubset<T, disponibilitesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$disponibilitesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Disponibilites.
     * @param {disponibilitesUpsertArgs} args - Arguments to update or create a Disponibilites.
     * @example
     * // Update or create a Disponibilites
     * const disponibilites = await prisma.disponibilites.upsert({
     *   create: {
     *     // ... data to create a Disponibilites
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Disponibilites we want to update
     *   }
     * })
     */
    upsert<T extends disponibilitesUpsertArgs>(args: SelectSubset<T, disponibilitesUpsertArgs<ExtArgs>>): Prisma__disponibilitesClient<$Result.GetResult<Prisma.$disponibilitesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Disponibilites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {disponibilitesCountArgs} args - Arguments to filter Disponibilites to count.
     * @example
     * // Count the number of Disponibilites
     * const count = await prisma.disponibilites.count({
     *   where: {
     *     // ... the filter for the Disponibilites we want to count
     *   }
     * })
    **/
    count<T extends disponibilitesCountArgs>(
      args?: Subset<T, disponibilitesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DisponibilitesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Disponibilites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisponibilitesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DisponibilitesAggregateArgs>(args: Subset<T, DisponibilitesAggregateArgs>): Prisma.PrismaPromise<GetDisponibilitesAggregateType<T>>

    /**
     * Group by Disponibilites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {disponibilitesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends disponibilitesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: disponibilitesGroupByArgs['orderBy'] }
        : { orderBy?: disponibilitesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, disponibilitesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDisponibilitesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the disponibilites model
   */
  readonly fields: disponibilitesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for disponibilites.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__disponibilitesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    jardin<T extends disponibilites$jardinArgs<ExtArgs> = {}>(args?: Subset<T, disponibilites$jardinArgs<ExtArgs>>): Prisma__jardinClient<$Result.GetResult<Prisma.$jardinPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    reservation<T extends disponibilites$reservationArgs<ExtArgs> = {}>(args?: Subset<T, disponibilites$reservationArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reservationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the disponibilites model
   */
  interface disponibilitesFieldRefs {
    readonly id_disponibilite: FieldRef<"disponibilites", 'BigInt'>
    readonly id_jardin: FieldRef<"disponibilites", 'BigInt'>
    readonly date_dispo: FieldRef<"disponibilites", 'DateTime'>
    readonly heure_debut: FieldRef<"disponibilites", 'DateTime'>
    readonly heure_fin: FieldRef<"disponibilites", 'DateTime'>
    readonly statut: FieldRef<"disponibilites", 'String'>
  }
    

  // Custom InputTypes
  /**
   * disponibilites findUnique
   */
  export type disponibilitesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the disponibilites
     */
    select?: disponibilitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the disponibilites
     */
    omit?: disponibilitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: disponibilitesInclude<ExtArgs> | null
    /**
     * Filter, which disponibilites to fetch.
     */
    where: disponibilitesWhereUniqueInput
  }

  /**
   * disponibilites findUniqueOrThrow
   */
  export type disponibilitesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the disponibilites
     */
    select?: disponibilitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the disponibilites
     */
    omit?: disponibilitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: disponibilitesInclude<ExtArgs> | null
    /**
     * Filter, which disponibilites to fetch.
     */
    where: disponibilitesWhereUniqueInput
  }

  /**
   * disponibilites findFirst
   */
  export type disponibilitesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the disponibilites
     */
    select?: disponibilitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the disponibilites
     */
    omit?: disponibilitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: disponibilitesInclude<ExtArgs> | null
    /**
     * Filter, which disponibilites to fetch.
     */
    where?: disponibilitesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of disponibilites to fetch.
     */
    orderBy?: disponibilitesOrderByWithRelationInput | disponibilitesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for disponibilites.
     */
    cursor?: disponibilitesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` disponibilites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` disponibilites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of disponibilites.
     */
    distinct?: DisponibilitesScalarFieldEnum | DisponibilitesScalarFieldEnum[]
  }

  /**
   * disponibilites findFirstOrThrow
   */
  export type disponibilitesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the disponibilites
     */
    select?: disponibilitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the disponibilites
     */
    omit?: disponibilitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: disponibilitesInclude<ExtArgs> | null
    /**
     * Filter, which disponibilites to fetch.
     */
    where?: disponibilitesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of disponibilites to fetch.
     */
    orderBy?: disponibilitesOrderByWithRelationInput | disponibilitesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for disponibilites.
     */
    cursor?: disponibilitesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` disponibilites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` disponibilites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of disponibilites.
     */
    distinct?: DisponibilitesScalarFieldEnum | DisponibilitesScalarFieldEnum[]
  }

  /**
   * disponibilites findMany
   */
  export type disponibilitesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the disponibilites
     */
    select?: disponibilitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the disponibilites
     */
    omit?: disponibilitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: disponibilitesInclude<ExtArgs> | null
    /**
     * Filter, which disponibilites to fetch.
     */
    where?: disponibilitesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of disponibilites to fetch.
     */
    orderBy?: disponibilitesOrderByWithRelationInput | disponibilitesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing disponibilites.
     */
    cursor?: disponibilitesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` disponibilites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` disponibilites.
     */
    skip?: number
    distinct?: DisponibilitesScalarFieldEnum | DisponibilitesScalarFieldEnum[]
  }

  /**
   * disponibilites create
   */
  export type disponibilitesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the disponibilites
     */
    select?: disponibilitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the disponibilites
     */
    omit?: disponibilitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: disponibilitesInclude<ExtArgs> | null
    /**
     * The data needed to create a disponibilites.
     */
    data?: XOR<disponibilitesCreateInput, disponibilitesUncheckedCreateInput>
  }

  /**
   * disponibilites createMany
   */
  export type disponibilitesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many disponibilites.
     */
    data: disponibilitesCreateManyInput | disponibilitesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * disponibilites createManyAndReturn
   */
  export type disponibilitesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the disponibilites
     */
    select?: disponibilitesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the disponibilites
     */
    omit?: disponibilitesOmit<ExtArgs> | null
    /**
     * The data used to create many disponibilites.
     */
    data: disponibilitesCreateManyInput | disponibilitesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: disponibilitesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * disponibilites update
   */
  export type disponibilitesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the disponibilites
     */
    select?: disponibilitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the disponibilites
     */
    omit?: disponibilitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: disponibilitesInclude<ExtArgs> | null
    /**
     * The data needed to update a disponibilites.
     */
    data: XOR<disponibilitesUpdateInput, disponibilitesUncheckedUpdateInput>
    /**
     * Choose, which disponibilites to update.
     */
    where: disponibilitesWhereUniqueInput
  }

  /**
   * disponibilites updateMany
   */
  export type disponibilitesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update disponibilites.
     */
    data: XOR<disponibilitesUpdateManyMutationInput, disponibilitesUncheckedUpdateManyInput>
    /**
     * Filter which disponibilites to update
     */
    where?: disponibilitesWhereInput
    /**
     * Limit how many disponibilites to update.
     */
    limit?: number
  }

  /**
   * disponibilites updateManyAndReturn
   */
  export type disponibilitesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the disponibilites
     */
    select?: disponibilitesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the disponibilites
     */
    omit?: disponibilitesOmit<ExtArgs> | null
    /**
     * The data used to update disponibilites.
     */
    data: XOR<disponibilitesUpdateManyMutationInput, disponibilitesUncheckedUpdateManyInput>
    /**
     * Filter which disponibilites to update
     */
    where?: disponibilitesWhereInput
    /**
     * Limit how many disponibilites to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: disponibilitesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * disponibilites upsert
   */
  export type disponibilitesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the disponibilites
     */
    select?: disponibilitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the disponibilites
     */
    omit?: disponibilitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: disponibilitesInclude<ExtArgs> | null
    /**
     * The filter to search for the disponibilites to update in case it exists.
     */
    where: disponibilitesWhereUniqueInput
    /**
     * In case the disponibilites found by the `where` argument doesn't exist, create a new disponibilites with this data.
     */
    create: XOR<disponibilitesCreateInput, disponibilitesUncheckedCreateInput>
    /**
     * In case the disponibilites was found with the provided `where` argument, update it with this data.
     */
    update: XOR<disponibilitesUpdateInput, disponibilitesUncheckedUpdateInput>
  }

  /**
   * disponibilites delete
   */
  export type disponibilitesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the disponibilites
     */
    select?: disponibilitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the disponibilites
     */
    omit?: disponibilitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: disponibilitesInclude<ExtArgs> | null
    /**
     * Filter which disponibilites to delete.
     */
    where: disponibilitesWhereUniqueInput
  }

  /**
   * disponibilites deleteMany
   */
  export type disponibilitesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which disponibilites to delete
     */
    where?: disponibilitesWhereInput
    /**
     * Limit how many disponibilites to delete.
     */
    limit?: number
  }

  /**
   * disponibilites.jardin
   */
  export type disponibilites$jardinArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jardin
     */
    select?: jardinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jardin
     */
    omit?: jardinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jardinInclude<ExtArgs> | null
    where?: jardinWhereInput
  }

  /**
   * disponibilites.reservation
   */
  export type disponibilites$reservationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reservation
     */
    select?: reservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reservation
     */
    omit?: reservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reservationInclude<ExtArgs> | null
    where?: reservationWhereInput
    orderBy?: reservationOrderByWithRelationInput | reservationOrderByWithRelationInput[]
    cursor?: reservationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * disponibilites without action
   */
  export type disponibilitesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the disponibilites
     */
    select?: disponibilitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the disponibilites
     */
    omit?: disponibilitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: disponibilitesInclude<ExtArgs> | null
  }


  /**
   * Model heurescumul_es
   */

  export type AggregateHeurescumul_es = {
    _count: Heurescumul_esCountAggregateOutputType | null
    _avg: Heurescumul_esAvgAggregateOutputType | null
    _sum: Heurescumul_esSumAggregateOutputType | null
    _min: Heurescumul_esMinAggregateOutputType | null
    _max: Heurescumul_esMaxAggregateOutputType | null
  }

  export type Heurescumul_esAvgAggregateOutputType = {
    id_historique: number | null
    id_utilisateur: number | null
    heures_travaillees: number | null
  }

  export type Heurescumul_esSumAggregateOutputType = {
    id_historique: bigint | null
    id_utilisateur: bigint | null
    heures_travaillees: number | null
  }

  export type Heurescumul_esMinAggregateOutputType = {
    id_historique: bigint | null
    id_utilisateur: bigint | null
    heures_travaillees: number | null
    date_maj: Date | null
  }

  export type Heurescumul_esMaxAggregateOutputType = {
    id_historique: bigint | null
    id_utilisateur: bigint | null
    heures_travaillees: number | null
    date_maj: Date | null
  }

  export type Heurescumul_esCountAggregateOutputType = {
    id_historique: number
    id_utilisateur: number
    heures_travaillees: number
    date_maj: number
    _all: number
  }


  export type Heurescumul_esAvgAggregateInputType = {
    id_historique?: true
    id_utilisateur?: true
    heures_travaillees?: true
  }

  export type Heurescumul_esSumAggregateInputType = {
    id_historique?: true
    id_utilisateur?: true
    heures_travaillees?: true
  }

  export type Heurescumul_esMinAggregateInputType = {
    id_historique?: true
    id_utilisateur?: true
    heures_travaillees?: true
    date_maj?: true
  }

  export type Heurescumul_esMaxAggregateInputType = {
    id_historique?: true
    id_utilisateur?: true
    heures_travaillees?: true
    date_maj?: true
  }

  export type Heurescumul_esCountAggregateInputType = {
    id_historique?: true
    id_utilisateur?: true
    heures_travaillees?: true
    date_maj?: true
    _all?: true
  }

  export type Heurescumul_esAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which heurescumul_es to aggregate.
     */
    where?: heurescumul_esWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of heurescumul_es to fetch.
     */
    orderBy?: heurescumul_esOrderByWithRelationInput | heurescumul_esOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: heurescumul_esWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` heurescumul_es from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` heurescumul_es.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned heurescumul_es
    **/
    _count?: true | Heurescumul_esCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Heurescumul_esAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Heurescumul_esSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Heurescumul_esMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Heurescumul_esMaxAggregateInputType
  }

  export type GetHeurescumul_esAggregateType<T extends Heurescumul_esAggregateArgs> = {
        [P in keyof T & keyof AggregateHeurescumul_es]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHeurescumul_es[P]>
      : GetScalarType<T[P], AggregateHeurescumul_es[P]>
  }




  export type heurescumul_esGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: heurescumul_esWhereInput
    orderBy?: heurescumul_esOrderByWithAggregationInput | heurescumul_esOrderByWithAggregationInput[]
    by: Heurescumul_esScalarFieldEnum[] | Heurescumul_esScalarFieldEnum
    having?: heurescumul_esScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Heurescumul_esCountAggregateInputType | true
    _avg?: Heurescumul_esAvgAggregateInputType
    _sum?: Heurescumul_esSumAggregateInputType
    _min?: Heurescumul_esMinAggregateInputType
    _max?: Heurescumul_esMaxAggregateInputType
  }

  export type Heurescumul_esGroupByOutputType = {
    id_historique: bigint
    id_utilisateur: bigint | null
    heures_travaillees: number | null
    date_maj: Date | null
    _count: Heurescumul_esCountAggregateOutputType | null
    _avg: Heurescumul_esAvgAggregateOutputType | null
    _sum: Heurescumul_esSumAggregateOutputType | null
    _min: Heurescumul_esMinAggregateOutputType | null
    _max: Heurescumul_esMaxAggregateOutputType | null
  }

  type GetHeurescumul_esGroupByPayload<T extends heurescumul_esGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Heurescumul_esGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Heurescumul_esGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Heurescumul_esGroupByOutputType[P]>
            : GetScalarType<T[P], Heurescumul_esGroupByOutputType[P]>
        }
      >
    >


  export type heurescumul_esSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_historique?: boolean
    id_utilisateur?: boolean
    heures_travaillees?: boolean
    date_maj?: boolean
    utilisateur?: boolean | heurescumul_es$utilisateurArgs<ExtArgs>
  }, ExtArgs["result"]["heurescumul_es"]>

  export type heurescumul_esSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_historique?: boolean
    id_utilisateur?: boolean
    heures_travaillees?: boolean
    date_maj?: boolean
    utilisateur?: boolean | heurescumul_es$utilisateurArgs<ExtArgs>
  }, ExtArgs["result"]["heurescumul_es"]>

  export type heurescumul_esSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_historique?: boolean
    id_utilisateur?: boolean
    heures_travaillees?: boolean
    date_maj?: boolean
    utilisateur?: boolean | heurescumul_es$utilisateurArgs<ExtArgs>
  }, ExtArgs["result"]["heurescumul_es"]>

  export type heurescumul_esSelectScalar = {
    id_historique?: boolean
    id_utilisateur?: boolean
    heures_travaillees?: boolean
    date_maj?: boolean
  }

  export type heurescumul_esOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id_historique" | "id_utilisateur" | "heures_travaillees" | "date_maj", ExtArgs["result"]["heurescumul_es"]>
  export type heurescumul_esInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    utilisateur?: boolean | heurescumul_es$utilisateurArgs<ExtArgs>
  }
  export type heurescumul_esIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    utilisateur?: boolean | heurescumul_es$utilisateurArgs<ExtArgs>
  }
  export type heurescumul_esIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    utilisateur?: boolean | heurescumul_es$utilisateurArgs<ExtArgs>
  }

  export type $heurescumul_esPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "heurescumul_es"
    objects: {
      utilisateur: Prisma.$utilisateurPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id_historique: bigint
      id_utilisateur: bigint | null
      heures_travaillees: number | null
      date_maj: Date | null
    }, ExtArgs["result"]["heurescumul_es"]>
    composites: {}
  }

  type heurescumul_esGetPayload<S extends boolean | null | undefined | heurescumul_esDefaultArgs> = $Result.GetResult<Prisma.$heurescumul_esPayload, S>

  type heurescumul_esCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<heurescumul_esFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Heurescumul_esCountAggregateInputType | true
    }

  export interface heurescumul_esDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['heurescumul_es'], meta: { name: 'heurescumul_es' } }
    /**
     * Find zero or one Heurescumul_es that matches the filter.
     * @param {heurescumul_esFindUniqueArgs} args - Arguments to find a Heurescumul_es
     * @example
     * // Get one Heurescumul_es
     * const heurescumul_es = await prisma.heurescumul_es.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends heurescumul_esFindUniqueArgs>(args: SelectSubset<T, heurescumul_esFindUniqueArgs<ExtArgs>>): Prisma__heurescumul_esClient<$Result.GetResult<Prisma.$heurescumul_esPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Heurescumul_es that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {heurescumul_esFindUniqueOrThrowArgs} args - Arguments to find a Heurescumul_es
     * @example
     * // Get one Heurescumul_es
     * const heurescumul_es = await prisma.heurescumul_es.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends heurescumul_esFindUniqueOrThrowArgs>(args: SelectSubset<T, heurescumul_esFindUniqueOrThrowArgs<ExtArgs>>): Prisma__heurescumul_esClient<$Result.GetResult<Prisma.$heurescumul_esPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Heurescumul_es that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {heurescumul_esFindFirstArgs} args - Arguments to find a Heurescumul_es
     * @example
     * // Get one Heurescumul_es
     * const heurescumul_es = await prisma.heurescumul_es.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends heurescumul_esFindFirstArgs>(args?: SelectSubset<T, heurescumul_esFindFirstArgs<ExtArgs>>): Prisma__heurescumul_esClient<$Result.GetResult<Prisma.$heurescumul_esPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Heurescumul_es that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {heurescumul_esFindFirstOrThrowArgs} args - Arguments to find a Heurescumul_es
     * @example
     * // Get one Heurescumul_es
     * const heurescumul_es = await prisma.heurescumul_es.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends heurescumul_esFindFirstOrThrowArgs>(args?: SelectSubset<T, heurescumul_esFindFirstOrThrowArgs<ExtArgs>>): Prisma__heurescumul_esClient<$Result.GetResult<Prisma.$heurescumul_esPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Heurescumul_es that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {heurescumul_esFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Heurescumul_es
     * const heurescumul_es = await prisma.heurescumul_es.findMany()
     * 
     * // Get first 10 Heurescumul_es
     * const heurescumul_es = await prisma.heurescumul_es.findMany({ take: 10 })
     * 
     * // Only select the `id_historique`
     * const heurescumul_esWithId_historiqueOnly = await prisma.heurescumul_es.findMany({ select: { id_historique: true } })
     * 
     */
    findMany<T extends heurescumul_esFindManyArgs>(args?: SelectSubset<T, heurescumul_esFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$heurescumul_esPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Heurescumul_es.
     * @param {heurescumul_esCreateArgs} args - Arguments to create a Heurescumul_es.
     * @example
     * // Create one Heurescumul_es
     * const Heurescumul_es = await prisma.heurescumul_es.create({
     *   data: {
     *     // ... data to create a Heurescumul_es
     *   }
     * })
     * 
     */
    create<T extends heurescumul_esCreateArgs>(args: SelectSubset<T, heurescumul_esCreateArgs<ExtArgs>>): Prisma__heurescumul_esClient<$Result.GetResult<Prisma.$heurescumul_esPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Heurescumul_es.
     * @param {heurescumul_esCreateManyArgs} args - Arguments to create many Heurescumul_es.
     * @example
     * // Create many Heurescumul_es
     * const heurescumul_es = await prisma.heurescumul_es.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends heurescumul_esCreateManyArgs>(args?: SelectSubset<T, heurescumul_esCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Heurescumul_es and returns the data saved in the database.
     * @param {heurescumul_esCreateManyAndReturnArgs} args - Arguments to create many Heurescumul_es.
     * @example
     * // Create many Heurescumul_es
     * const heurescumul_es = await prisma.heurescumul_es.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Heurescumul_es and only return the `id_historique`
     * const heurescumul_esWithId_historiqueOnly = await prisma.heurescumul_es.createManyAndReturn({
     *   select: { id_historique: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends heurescumul_esCreateManyAndReturnArgs>(args?: SelectSubset<T, heurescumul_esCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$heurescumul_esPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Heurescumul_es.
     * @param {heurescumul_esDeleteArgs} args - Arguments to delete one Heurescumul_es.
     * @example
     * // Delete one Heurescumul_es
     * const Heurescumul_es = await prisma.heurescumul_es.delete({
     *   where: {
     *     // ... filter to delete one Heurescumul_es
     *   }
     * })
     * 
     */
    delete<T extends heurescumul_esDeleteArgs>(args: SelectSubset<T, heurescumul_esDeleteArgs<ExtArgs>>): Prisma__heurescumul_esClient<$Result.GetResult<Prisma.$heurescumul_esPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Heurescumul_es.
     * @param {heurescumul_esUpdateArgs} args - Arguments to update one Heurescumul_es.
     * @example
     * // Update one Heurescumul_es
     * const heurescumul_es = await prisma.heurescumul_es.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends heurescumul_esUpdateArgs>(args: SelectSubset<T, heurescumul_esUpdateArgs<ExtArgs>>): Prisma__heurescumul_esClient<$Result.GetResult<Prisma.$heurescumul_esPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Heurescumul_es.
     * @param {heurescumul_esDeleteManyArgs} args - Arguments to filter Heurescumul_es to delete.
     * @example
     * // Delete a few Heurescumul_es
     * const { count } = await prisma.heurescumul_es.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends heurescumul_esDeleteManyArgs>(args?: SelectSubset<T, heurescumul_esDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Heurescumul_es.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {heurescumul_esUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Heurescumul_es
     * const heurescumul_es = await prisma.heurescumul_es.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends heurescumul_esUpdateManyArgs>(args: SelectSubset<T, heurescumul_esUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Heurescumul_es and returns the data updated in the database.
     * @param {heurescumul_esUpdateManyAndReturnArgs} args - Arguments to update many Heurescumul_es.
     * @example
     * // Update many Heurescumul_es
     * const heurescumul_es = await prisma.heurescumul_es.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Heurescumul_es and only return the `id_historique`
     * const heurescumul_esWithId_historiqueOnly = await prisma.heurescumul_es.updateManyAndReturn({
     *   select: { id_historique: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends heurescumul_esUpdateManyAndReturnArgs>(args: SelectSubset<T, heurescumul_esUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$heurescumul_esPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Heurescumul_es.
     * @param {heurescumul_esUpsertArgs} args - Arguments to update or create a Heurescumul_es.
     * @example
     * // Update or create a Heurescumul_es
     * const heurescumul_es = await prisma.heurescumul_es.upsert({
     *   create: {
     *     // ... data to create a Heurescumul_es
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Heurescumul_es we want to update
     *   }
     * })
     */
    upsert<T extends heurescumul_esUpsertArgs>(args: SelectSubset<T, heurescumul_esUpsertArgs<ExtArgs>>): Prisma__heurescumul_esClient<$Result.GetResult<Prisma.$heurescumul_esPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Heurescumul_es.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {heurescumul_esCountArgs} args - Arguments to filter Heurescumul_es to count.
     * @example
     * // Count the number of Heurescumul_es
     * const count = await prisma.heurescumul_es.count({
     *   where: {
     *     // ... the filter for the Heurescumul_es we want to count
     *   }
     * })
    **/
    count<T extends heurescumul_esCountArgs>(
      args?: Subset<T, heurescumul_esCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Heurescumul_esCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Heurescumul_es.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Heurescumul_esAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Heurescumul_esAggregateArgs>(args: Subset<T, Heurescumul_esAggregateArgs>): Prisma.PrismaPromise<GetHeurescumul_esAggregateType<T>>

    /**
     * Group by Heurescumul_es.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {heurescumul_esGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends heurescumul_esGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: heurescumul_esGroupByArgs['orderBy'] }
        : { orderBy?: heurescumul_esGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, heurescumul_esGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHeurescumul_esGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the heurescumul_es model
   */
  readonly fields: heurescumul_esFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for heurescumul_es.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__heurescumul_esClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    utilisateur<T extends heurescumul_es$utilisateurArgs<ExtArgs> = {}>(args?: Subset<T, heurescumul_es$utilisateurArgs<ExtArgs>>): Prisma__utilisateurClient<$Result.GetResult<Prisma.$utilisateurPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the heurescumul_es model
   */
  interface heurescumul_esFieldRefs {
    readonly id_historique: FieldRef<"heurescumul_es", 'BigInt'>
    readonly id_utilisateur: FieldRef<"heurescumul_es", 'BigInt'>
    readonly heures_travaillees: FieldRef<"heurescumul_es", 'Float'>
    readonly date_maj: FieldRef<"heurescumul_es", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * heurescumul_es findUnique
   */
  export type heurescumul_esFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the heurescumul_es
     */
    select?: heurescumul_esSelect<ExtArgs> | null
    /**
     * Omit specific fields from the heurescumul_es
     */
    omit?: heurescumul_esOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: heurescumul_esInclude<ExtArgs> | null
    /**
     * Filter, which heurescumul_es to fetch.
     */
    where: heurescumul_esWhereUniqueInput
  }

  /**
   * heurescumul_es findUniqueOrThrow
   */
  export type heurescumul_esFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the heurescumul_es
     */
    select?: heurescumul_esSelect<ExtArgs> | null
    /**
     * Omit specific fields from the heurescumul_es
     */
    omit?: heurescumul_esOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: heurescumul_esInclude<ExtArgs> | null
    /**
     * Filter, which heurescumul_es to fetch.
     */
    where: heurescumul_esWhereUniqueInput
  }

  /**
   * heurescumul_es findFirst
   */
  export type heurescumul_esFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the heurescumul_es
     */
    select?: heurescumul_esSelect<ExtArgs> | null
    /**
     * Omit specific fields from the heurescumul_es
     */
    omit?: heurescumul_esOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: heurescumul_esInclude<ExtArgs> | null
    /**
     * Filter, which heurescumul_es to fetch.
     */
    where?: heurescumul_esWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of heurescumul_es to fetch.
     */
    orderBy?: heurescumul_esOrderByWithRelationInput | heurescumul_esOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for heurescumul_es.
     */
    cursor?: heurescumul_esWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` heurescumul_es from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` heurescumul_es.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of heurescumul_es.
     */
    distinct?: Heurescumul_esScalarFieldEnum | Heurescumul_esScalarFieldEnum[]
  }

  /**
   * heurescumul_es findFirstOrThrow
   */
  export type heurescumul_esFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the heurescumul_es
     */
    select?: heurescumul_esSelect<ExtArgs> | null
    /**
     * Omit specific fields from the heurescumul_es
     */
    omit?: heurescumul_esOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: heurescumul_esInclude<ExtArgs> | null
    /**
     * Filter, which heurescumul_es to fetch.
     */
    where?: heurescumul_esWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of heurescumul_es to fetch.
     */
    orderBy?: heurescumul_esOrderByWithRelationInput | heurescumul_esOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for heurescumul_es.
     */
    cursor?: heurescumul_esWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` heurescumul_es from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` heurescumul_es.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of heurescumul_es.
     */
    distinct?: Heurescumul_esScalarFieldEnum | Heurescumul_esScalarFieldEnum[]
  }

  /**
   * heurescumul_es findMany
   */
  export type heurescumul_esFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the heurescumul_es
     */
    select?: heurescumul_esSelect<ExtArgs> | null
    /**
     * Omit specific fields from the heurescumul_es
     */
    omit?: heurescumul_esOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: heurescumul_esInclude<ExtArgs> | null
    /**
     * Filter, which heurescumul_es to fetch.
     */
    where?: heurescumul_esWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of heurescumul_es to fetch.
     */
    orderBy?: heurescumul_esOrderByWithRelationInput | heurescumul_esOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing heurescumul_es.
     */
    cursor?: heurescumul_esWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` heurescumul_es from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` heurescumul_es.
     */
    skip?: number
    distinct?: Heurescumul_esScalarFieldEnum | Heurescumul_esScalarFieldEnum[]
  }

  /**
   * heurescumul_es create
   */
  export type heurescumul_esCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the heurescumul_es
     */
    select?: heurescumul_esSelect<ExtArgs> | null
    /**
     * Omit specific fields from the heurescumul_es
     */
    omit?: heurescumul_esOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: heurescumul_esInclude<ExtArgs> | null
    /**
     * The data needed to create a heurescumul_es.
     */
    data?: XOR<heurescumul_esCreateInput, heurescumul_esUncheckedCreateInput>
  }

  /**
   * heurescumul_es createMany
   */
  export type heurescumul_esCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many heurescumul_es.
     */
    data: heurescumul_esCreateManyInput | heurescumul_esCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * heurescumul_es createManyAndReturn
   */
  export type heurescumul_esCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the heurescumul_es
     */
    select?: heurescumul_esSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the heurescumul_es
     */
    omit?: heurescumul_esOmit<ExtArgs> | null
    /**
     * The data used to create many heurescumul_es.
     */
    data: heurescumul_esCreateManyInput | heurescumul_esCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: heurescumul_esIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * heurescumul_es update
   */
  export type heurescumul_esUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the heurescumul_es
     */
    select?: heurescumul_esSelect<ExtArgs> | null
    /**
     * Omit specific fields from the heurescumul_es
     */
    omit?: heurescumul_esOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: heurescumul_esInclude<ExtArgs> | null
    /**
     * The data needed to update a heurescumul_es.
     */
    data: XOR<heurescumul_esUpdateInput, heurescumul_esUncheckedUpdateInput>
    /**
     * Choose, which heurescumul_es to update.
     */
    where: heurescumul_esWhereUniqueInput
  }

  /**
   * heurescumul_es updateMany
   */
  export type heurescumul_esUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update heurescumul_es.
     */
    data: XOR<heurescumul_esUpdateManyMutationInput, heurescumul_esUncheckedUpdateManyInput>
    /**
     * Filter which heurescumul_es to update
     */
    where?: heurescumul_esWhereInput
    /**
     * Limit how many heurescumul_es to update.
     */
    limit?: number
  }

  /**
   * heurescumul_es updateManyAndReturn
   */
  export type heurescumul_esUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the heurescumul_es
     */
    select?: heurescumul_esSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the heurescumul_es
     */
    omit?: heurescumul_esOmit<ExtArgs> | null
    /**
     * The data used to update heurescumul_es.
     */
    data: XOR<heurescumul_esUpdateManyMutationInput, heurescumul_esUncheckedUpdateManyInput>
    /**
     * Filter which heurescumul_es to update
     */
    where?: heurescumul_esWhereInput
    /**
     * Limit how many heurescumul_es to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: heurescumul_esIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * heurescumul_es upsert
   */
  export type heurescumul_esUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the heurescumul_es
     */
    select?: heurescumul_esSelect<ExtArgs> | null
    /**
     * Omit specific fields from the heurescumul_es
     */
    omit?: heurescumul_esOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: heurescumul_esInclude<ExtArgs> | null
    /**
     * The filter to search for the heurescumul_es to update in case it exists.
     */
    where: heurescumul_esWhereUniqueInput
    /**
     * In case the heurescumul_es found by the `where` argument doesn't exist, create a new heurescumul_es with this data.
     */
    create: XOR<heurescumul_esCreateInput, heurescumul_esUncheckedCreateInput>
    /**
     * In case the heurescumul_es was found with the provided `where` argument, update it with this data.
     */
    update: XOR<heurescumul_esUpdateInput, heurescumul_esUncheckedUpdateInput>
  }

  /**
   * heurescumul_es delete
   */
  export type heurescumul_esDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the heurescumul_es
     */
    select?: heurescumul_esSelect<ExtArgs> | null
    /**
     * Omit specific fields from the heurescumul_es
     */
    omit?: heurescumul_esOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: heurescumul_esInclude<ExtArgs> | null
    /**
     * Filter which heurescumul_es to delete.
     */
    where: heurescumul_esWhereUniqueInput
  }

  /**
   * heurescumul_es deleteMany
   */
  export type heurescumul_esDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which heurescumul_es to delete
     */
    where?: heurescumul_esWhereInput
    /**
     * Limit how many heurescumul_es to delete.
     */
    limit?: number
  }

  /**
   * heurescumul_es.utilisateur
   */
  export type heurescumul_es$utilisateurArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateur
     */
    select?: utilisateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateur
     */
    omit?: utilisateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurInclude<ExtArgs> | null
    where?: utilisateurWhereInput
  }

  /**
   * heurescumul_es without action
   */
  export type heurescumul_esDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the heurescumul_es
     */
    select?: heurescumul_esSelect<ExtArgs> | null
    /**
     * Omit specific fields from the heurescumul_es
     */
    omit?: heurescumul_esOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: heurescumul_esInclude<ExtArgs> | null
  }


  /**
   * Model jardin
   */

  export type AggregateJardin = {
    _count: JardinCountAggregateOutputType | null
    _avg: JardinAvgAggregateOutputType | null
    _sum: JardinSumAggregateOutputType | null
    _min: JardinMinAggregateOutputType | null
    _max: JardinMaxAggregateOutputType | null
  }

  export type JardinAvgAggregateOutputType = {
    id_jardin: number | null
    id_proprietaire: number | null
    superficie: number | null
    note_moyenne: number | null
  }

  export type JardinSumAggregateOutputType = {
    id_jardin: bigint | null
    id_proprietaire: bigint | null
    superficie: number | null
    note_moyenne: number | null
  }

  export type JardinMinAggregateOutputType = {
    id_jardin: bigint | null
    id_proprietaire: bigint | null
    titre: string | null
    description: string | null
    adresse: string | null
    superficie: number | null
    type: string | null
    besoins: string | null
    date_publication: Date | null
    statut: string | null
    note_moyenne: number | null
  }

  export type JardinMaxAggregateOutputType = {
    id_jardin: bigint | null
    id_proprietaire: bigint | null
    titre: string | null
    description: string | null
    adresse: string | null
    superficie: number | null
    type: string | null
    besoins: string | null
    date_publication: Date | null
    statut: string | null
    note_moyenne: number | null
  }

  export type JardinCountAggregateOutputType = {
    id_jardin: number
    id_proprietaire: number
    titre: number
    description: number
    adresse: number
    superficie: number
    type: number
    besoins: number
    photos: number
    date_publication: number
    statut: number
    note_moyenne: number
    _all: number
  }


  export type JardinAvgAggregateInputType = {
    id_jardin?: true
    id_proprietaire?: true
    superficie?: true
    note_moyenne?: true
  }

  export type JardinSumAggregateInputType = {
    id_jardin?: true
    id_proprietaire?: true
    superficie?: true
    note_moyenne?: true
  }

  export type JardinMinAggregateInputType = {
    id_jardin?: true
    id_proprietaire?: true
    titre?: true
    description?: true
    adresse?: true
    superficie?: true
    type?: true
    besoins?: true
    date_publication?: true
    statut?: true
    note_moyenne?: true
  }

  export type JardinMaxAggregateInputType = {
    id_jardin?: true
    id_proprietaire?: true
    titre?: true
    description?: true
    adresse?: true
    superficie?: true
    type?: true
    besoins?: true
    date_publication?: true
    statut?: true
    note_moyenne?: true
  }

  export type JardinCountAggregateInputType = {
    id_jardin?: true
    id_proprietaire?: true
    titre?: true
    description?: true
    adresse?: true
    superficie?: true
    type?: true
    besoins?: true
    photos?: true
    date_publication?: true
    statut?: true
    note_moyenne?: true
    _all?: true
  }

  export type JardinAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which jardin to aggregate.
     */
    where?: jardinWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of jardins to fetch.
     */
    orderBy?: jardinOrderByWithRelationInput | jardinOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: jardinWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` jardins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` jardins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned jardins
    **/
    _count?: true | JardinCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: JardinAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: JardinSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JardinMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JardinMaxAggregateInputType
  }

  export type GetJardinAggregateType<T extends JardinAggregateArgs> = {
        [P in keyof T & keyof AggregateJardin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJardin[P]>
      : GetScalarType<T[P], AggregateJardin[P]>
  }




  export type jardinGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: jardinWhereInput
    orderBy?: jardinOrderByWithAggregationInput | jardinOrderByWithAggregationInput[]
    by: JardinScalarFieldEnum[] | JardinScalarFieldEnum
    having?: jardinScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JardinCountAggregateInputType | true
    _avg?: JardinAvgAggregateInputType
    _sum?: JardinSumAggregateInputType
    _min?: JardinMinAggregateInputType
    _max?: JardinMaxAggregateInputType
  }

  export type JardinGroupByOutputType = {
    id_jardin: bigint
    id_proprietaire: bigint
    titre: string | null
    description: string | null
    adresse: string | null
    superficie: number | null
    type: string | null
    besoins: string | null
    photos: JsonValue | null
    date_publication: Date | null
    statut: string | null
    note_moyenne: number | null
    _count: JardinCountAggregateOutputType | null
    _avg: JardinAvgAggregateOutputType | null
    _sum: JardinSumAggregateOutputType | null
    _min: JardinMinAggregateOutputType | null
    _max: JardinMaxAggregateOutputType | null
  }

  type GetJardinGroupByPayload<T extends jardinGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JardinGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JardinGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JardinGroupByOutputType[P]>
            : GetScalarType<T[P], JardinGroupByOutputType[P]>
        }
      >
    >


  export type jardinSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_jardin?: boolean
    id_proprietaire?: boolean
    titre?: boolean
    description?: boolean
    adresse?: boolean
    superficie?: boolean
    type?: boolean
    besoins?: boolean
    photos?: boolean
    date_publication?: boolean
    statut?: boolean
    note_moyenne?: boolean
    avis?: boolean | jardin$avisArgs<ExtArgs>
    disponibilites?: boolean | jardin$disponibilitesArgs<ExtArgs>
    utilisateur?: boolean | utilisateurDefaultArgs<ExtArgs>
    reservation?: boolean | jardin$reservationArgs<ExtArgs>
    _count?: boolean | JardinCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["jardin"]>

  export type jardinSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_jardin?: boolean
    id_proprietaire?: boolean
    titre?: boolean
    description?: boolean
    adresse?: boolean
    superficie?: boolean
    type?: boolean
    besoins?: boolean
    photos?: boolean
    date_publication?: boolean
    statut?: boolean
    note_moyenne?: boolean
    utilisateur?: boolean | utilisateurDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["jardin"]>

  export type jardinSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_jardin?: boolean
    id_proprietaire?: boolean
    titre?: boolean
    description?: boolean
    adresse?: boolean
    superficie?: boolean
    type?: boolean
    besoins?: boolean
    photos?: boolean
    date_publication?: boolean
    statut?: boolean
    note_moyenne?: boolean
    utilisateur?: boolean | utilisateurDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["jardin"]>

  export type jardinSelectScalar = {
    id_jardin?: boolean
    id_proprietaire?: boolean
    titre?: boolean
    description?: boolean
    adresse?: boolean
    superficie?: boolean
    type?: boolean
    besoins?: boolean
    photos?: boolean
    date_publication?: boolean
    statut?: boolean
    note_moyenne?: boolean
  }

  export type jardinOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id_jardin" | "id_proprietaire" | "titre" | "description" | "adresse" | "superficie" | "type" | "besoins" | "photos" | "date_publication" | "statut" | "note_moyenne", ExtArgs["result"]["jardin"]>
  export type jardinInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    avis?: boolean | jardin$avisArgs<ExtArgs>
    disponibilites?: boolean | jardin$disponibilitesArgs<ExtArgs>
    utilisateur?: boolean | utilisateurDefaultArgs<ExtArgs>
    reservation?: boolean | jardin$reservationArgs<ExtArgs>
    _count?: boolean | JardinCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type jardinIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    utilisateur?: boolean | utilisateurDefaultArgs<ExtArgs>
  }
  export type jardinIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    utilisateur?: boolean | utilisateurDefaultArgs<ExtArgs>
  }

  export type $jardinPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "jardin"
    objects: {
      avis: Prisma.$avisPayload<ExtArgs>[]
      disponibilites: Prisma.$disponibilitesPayload<ExtArgs>[]
      utilisateur: Prisma.$utilisateurPayload<ExtArgs>
      reservation: Prisma.$reservationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id_jardin: bigint
      id_proprietaire: bigint
      titre: string | null
      description: string | null
      adresse: string | null
      superficie: number | null
      type: string | null
      besoins: string | null
      photos: Prisma.JsonValue | null
      date_publication: Date | null
      statut: string | null
      note_moyenne: number | null
    }, ExtArgs["result"]["jardin"]>
    composites: {}
  }

  type jardinGetPayload<S extends boolean | null | undefined | jardinDefaultArgs> = $Result.GetResult<Prisma.$jardinPayload, S>

  type jardinCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<jardinFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JardinCountAggregateInputType | true
    }

  export interface jardinDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['jardin'], meta: { name: 'jardin' } }
    /**
     * Find zero or one Jardin that matches the filter.
     * @param {jardinFindUniqueArgs} args - Arguments to find a Jardin
     * @example
     * // Get one Jardin
     * const jardin = await prisma.jardin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends jardinFindUniqueArgs>(args: SelectSubset<T, jardinFindUniqueArgs<ExtArgs>>): Prisma__jardinClient<$Result.GetResult<Prisma.$jardinPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Jardin that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {jardinFindUniqueOrThrowArgs} args - Arguments to find a Jardin
     * @example
     * // Get one Jardin
     * const jardin = await prisma.jardin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends jardinFindUniqueOrThrowArgs>(args: SelectSubset<T, jardinFindUniqueOrThrowArgs<ExtArgs>>): Prisma__jardinClient<$Result.GetResult<Prisma.$jardinPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Jardin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {jardinFindFirstArgs} args - Arguments to find a Jardin
     * @example
     * // Get one Jardin
     * const jardin = await prisma.jardin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends jardinFindFirstArgs>(args?: SelectSubset<T, jardinFindFirstArgs<ExtArgs>>): Prisma__jardinClient<$Result.GetResult<Prisma.$jardinPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Jardin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {jardinFindFirstOrThrowArgs} args - Arguments to find a Jardin
     * @example
     * // Get one Jardin
     * const jardin = await prisma.jardin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends jardinFindFirstOrThrowArgs>(args?: SelectSubset<T, jardinFindFirstOrThrowArgs<ExtArgs>>): Prisma__jardinClient<$Result.GetResult<Prisma.$jardinPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Jardins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {jardinFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Jardins
     * const jardins = await prisma.jardin.findMany()
     * 
     * // Get first 10 Jardins
     * const jardins = await prisma.jardin.findMany({ take: 10 })
     * 
     * // Only select the `id_jardin`
     * const jardinWithId_jardinOnly = await prisma.jardin.findMany({ select: { id_jardin: true } })
     * 
     */
    findMany<T extends jardinFindManyArgs>(args?: SelectSubset<T, jardinFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$jardinPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Jardin.
     * @param {jardinCreateArgs} args - Arguments to create a Jardin.
     * @example
     * // Create one Jardin
     * const Jardin = await prisma.jardin.create({
     *   data: {
     *     // ... data to create a Jardin
     *   }
     * })
     * 
     */
    create<T extends jardinCreateArgs>(args: SelectSubset<T, jardinCreateArgs<ExtArgs>>): Prisma__jardinClient<$Result.GetResult<Prisma.$jardinPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Jardins.
     * @param {jardinCreateManyArgs} args - Arguments to create many Jardins.
     * @example
     * // Create many Jardins
     * const jardin = await prisma.jardin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends jardinCreateManyArgs>(args?: SelectSubset<T, jardinCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Jardins and returns the data saved in the database.
     * @param {jardinCreateManyAndReturnArgs} args - Arguments to create many Jardins.
     * @example
     * // Create many Jardins
     * const jardin = await prisma.jardin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Jardins and only return the `id_jardin`
     * const jardinWithId_jardinOnly = await prisma.jardin.createManyAndReturn({
     *   select: { id_jardin: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends jardinCreateManyAndReturnArgs>(args?: SelectSubset<T, jardinCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$jardinPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Jardin.
     * @param {jardinDeleteArgs} args - Arguments to delete one Jardin.
     * @example
     * // Delete one Jardin
     * const Jardin = await prisma.jardin.delete({
     *   where: {
     *     // ... filter to delete one Jardin
     *   }
     * })
     * 
     */
    delete<T extends jardinDeleteArgs>(args: SelectSubset<T, jardinDeleteArgs<ExtArgs>>): Prisma__jardinClient<$Result.GetResult<Prisma.$jardinPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Jardin.
     * @param {jardinUpdateArgs} args - Arguments to update one Jardin.
     * @example
     * // Update one Jardin
     * const jardin = await prisma.jardin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends jardinUpdateArgs>(args: SelectSubset<T, jardinUpdateArgs<ExtArgs>>): Prisma__jardinClient<$Result.GetResult<Prisma.$jardinPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Jardins.
     * @param {jardinDeleteManyArgs} args - Arguments to filter Jardins to delete.
     * @example
     * // Delete a few Jardins
     * const { count } = await prisma.jardin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends jardinDeleteManyArgs>(args?: SelectSubset<T, jardinDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jardins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {jardinUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Jardins
     * const jardin = await prisma.jardin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends jardinUpdateManyArgs>(args: SelectSubset<T, jardinUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jardins and returns the data updated in the database.
     * @param {jardinUpdateManyAndReturnArgs} args - Arguments to update many Jardins.
     * @example
     * // Update many Jardins
     * const jardin = await prisma.jardin.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Jardins and only return the `id_jardin`
     * const jardinWithId_jardinOnly = await prisma.jardin.updateManyAndReturn({
     *   select: { id_jardin: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends jardinUpdateManyAndReturnArgs>(args: SelectSubset<T, jardinUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$jardinPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Jardin.
     * @param {jardinUpsertArgs} args - Arguments to update or create a Jardin.
     * @example
     * // Update or create a Jardin
     * const jardin = await prisma.jardin.upsert({
     *   create: {
     *     // ... data to create a Jardin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Jardin we want to update
     *   }
     * })
     */
    upsert<T extends jardinUpsertArgs>(args: SelectSubset<T, jardinUpsertArgs<ExtArgs>>): Prisma__jardinClient<$Result.GetResult<Prisma.$jardinPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Jardins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {jardinCountArgs} args - Arguments to filter Jardins to count.
     * @example
     * // Count the number of Jardins
     * const count = await prisma.jardin.count({
     *   where: {
     *     // ... the filter for the Jardins we want to count
     *   }
     * })
    **/
    count<T extends jardinCountArgs>(
      args?: Subset<T, jardinCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JardinCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Jardin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JardinAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JardinAggregateArgs>(args: Subset<T, JardinAggregateArgs>): Prisma.PrismaPromise<GetJardinAggregateType<T>>

    /**
     * Group by Jardin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {jardinGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends jardinGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: jardinGroupByArgs['orderBy'] }
        : { orderBy?: jardinGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, jardinGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJardinGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the jardin model
   */
  readonly fields: jardinFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for jardin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__jardinClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    avis<T extends jardin$avisArgs<ExtArgs> = {}>(args?: Subset<T, jardin$avisArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$avisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    disponibilites<T extends jardin$disponibilitesArgs<ExtArgs> = {}>(args?: Subset<T, jardin$disponibilitesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$disponibilitesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    utilisateur<T extends utilisateurDefaultArgs<ExtArgs> = {}>(args?: Subset<T, utilisateurDefaultArgs<ExtArgs>>): Prisma__utilisateurClient<$Result.GetResult<Prisma.$utilisateurPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    reservation<T extends jardin$reservationArgs<ExtArgs> = {}>(args?: Subset<T, jardin$reservationArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reservationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the jardin model
   */
  interface jardinFieldRefs {
    readonly id_jardin: FieldRef<"jardin", 'BigInt'>
    readonly id_proprietaire: FieldRef<"jardin", 'BigInt'>
    readonly titre: FieldRef<"jardin", 'String'>
    readonly description: FieldRef<"jardin", 'String'>
    readonly adresse: FieldRef<"jardin", 'String'>
    readonly superficie: FieldRef<"jardin", 'Float'>
    readonly type: FieldRef<"jardin", 'String'>
    readonly besoins: FieldRef<"jardin", 'String'>
    readonly photos: FieldRef<"jardin", 'Json'>
    readonly date_publication: FieldRef<"jardin", 'DateTime'>
    readonly statut: FieldRef<"jardin", 'String'>
    readonly note_moyenne: FieldRef<"jardin", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * jardin findUnique
   */
  export type jardinFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jardin
     */
    select?: jardinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jardin
     */
    omit?: jardinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jardinInclude<ExtArgs> | null
    /**
     * Filter, which jardin to fetch.
     */
    where: jardinWhereUniqueInput
  }

  /**
   * jardin findUniqueOrThrow
   */
  export type jardinFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jardin
     */
    select?: jardinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jardin
     */
    omit?: jardinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jardinInclude<ExtArgs> | null
    /**
     * Filter, which jardin to fetch.
     */
    where: jardinWhereUniqueInput
  }

  /**
   * jardin findFirst
   */
  export type jardinFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jardin
     */
    select?: jardinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jardin
     */
    omit?: jardinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jardinInclude<ExtArgs> | null
    /**
     * Filter, which jardin to fetch.
     */
    where?: jardinWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of jardins to fetch.
     */
    orderBy?: jardinOrderByWithRelationInput | jardinOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for jardins.
     */
    cursor?: jardinWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` jardins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` jardins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of jardins.
     */
    distinct?: JardinScalarFieldEnum | JardinScalarFieldEnum[]
  }

  /**
   * jardin findFirstOrThrow
   */
  export type jardinFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jardin
     */
    select?: jardinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jardin
     */
    omit?: jardinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jardinInclude<ExtArgs> | null
    /**
     * Filter, which jardin to fetch.
     */
    where?: jardinWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of jardins to fetch.
     */
    orderBy?: jardinOrderByWithRelationInput | jardinOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for jardins.
     */
    cursor?: jardinWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` jardins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` jardins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of jardins.
     */
    distinct?: JardinScalarFieldEnum | JardinScalarFieldEnum[]
  }

  /**
   * jardin findMany
   */
  export type jardinFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jardin
     */
    select?: jardinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jardin
     */
    omit?: jardinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jardinInclude<ExtArgs> | null
    /**
     * Filter, which jardins to fetch.
     */
    where?: jardinWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of jardins to fetch.
     */
    orderBy?: jardinOrderByWithRelationInput | jardinOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing jardins.
     */
    cursor?: jardinWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` jardins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` jardins.
     */
    skip?: number
    distinct?: JardinScalarFieldEnum | JardinScalarFieldEnum[]
  }

  /**
   * jardin create
   */
  export type jardinCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jardin
     */
    select?: jardinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jardin
     */
    omit?: jardinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jardinInclude<ExtArgs> | null
    /**
     * The data needed to create a jardin.
     */
    data: XOR<jardinCreateInput, jardinUncheckedCreateInput>
  }

  /**
   * jardin createMany
   */
  export type jardinCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many jardins.
     */
    data: jardinCreateManyInput | jardinCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * jardin createManyAndReturn
   */
  export type jardinCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jardin
     */
    select?: jardinSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the jardin
     */
    omit?: jardinOmit<ExtArgs> | null
    /**
     * The data used to create many jardins.
     */
    data: jardinCreateManyInput | jardinCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jardinIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * jardin update
   */
  export type jardinUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jardin
     */
    select?: jardinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jardin
     */
    omit?: jardinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jardinInclude<ExtArgs> | null
    /**
     * The data needed to update a jardin.
     */
    data: XOR<jardinUpdateInput, jardinUncheckedUpdateInput>
    /**
     * Choose, which jardin to update.
     */
    where: jardinWhereUniqueInput
  }

  /**
   * jardin updateMany
   */
  export type jardinUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update jardins.
     */
    data: XOR<jardinUpdateManyMutationInput, jardinUncheckedUpdateManyInput>
    /**
     * Filter which jardins to update
     */
    where?: jardinWhereInput
    /**
     * Limit how many jardins to update.
     */
    limit?: number
  }

  /**
   * jardin updateManyAndReturn
   */
  export type jardinUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jardin
     */
    select?: jardinSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the jardin
     */
    omit?: jardinOmit<ExtArgs> | null
    /**
     * The data used to update jardins.
     */
    data: XOR<jardinUpdateManyMutationInput, jardinUncheckedUpdateManyInput>
    /**
     * Filter which jardins to update
     */
    where?: jardinWhereInput
    /**
     * Limit how many jardins to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jardinIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * jardin upsert
   */
  export type jardinUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jardin
     */
    select?: jardinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jardin
     */
    omit?: jardinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jardinInclude<ExtArgs> | null
    /**
     * The filter to search for the jardin to update in case it exists.
     */
    where: jardinWhereUniqueInput
    /**
     * In case the jardin found by the `where` argument doesn't exist, create a new jardin with this data.
     */
    create: XOR<jardinCreateInput, jardinUncheckedCreateInput>
    /**
     * In case the jardin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<jardinUpdateInput, jardinUncheckedUpdateInput>
  }

  /**
   * jardin delete
   */
  export type jardinDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jardin
     */
    select?: jardinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jardin
     */
    omit?: jardinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jardinInclude<ExtArgs> | null
    /**
     * Filter which jardin to delete.
     */
    where: jardinWhereUniqueInput
  }

  /**
   * jardin deleteMany
   */
  export type jardinDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which jardins to delete
     */
    where?: jardinWhereInput
    /**
     * Limit how many jardins to delete.
     */
    limit?: number
  }

  /**
   * jardin.avis
   */
  export type jardin$avisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the avis
     */
    select?: avisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the avis
     */
    omit?: avisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: avisInclude<ExtArgs> | null
    where?: avisWhereInput
    orderBy?: avisOrderByWithRelationInput | avisOrderByWithRelationInput[]
    cursor?: avisWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AvisScalarFieldEnum | AvisScalarFieldEnum[]
  }

  /**
   * jardin.disponibilites
   */
  export type jardin$disponibilitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the disponibilites
     */
    select?: disponibilitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the disponibilites
     */
    omit?: disponibilitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: disponibilitesInclude<ExtArgs> | null
    where?: disponibilitesWhereInput
    orderBy?: disponibilitesOrderByWithRelationInput | disponibilitesOrderByWithRelationInput[]
    cursor?: disponibilitesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DisponibilitesScalarFieldEnum | DisponibilitesScalarFieldEnum[]
  }

  /**
   * jardin.reservation
   */
  export type jardin$reservationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reservation
     */
    select?: reservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reservation
     */
    omit?: reservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reservationInclude<ExtArgs> | null
    where?: reservationWhereInput
    orderBy?: reservationOrderByWithRelationInput | reservationOrderByWithRelationInput[]
    cursor?: reservationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * jardin without action
   */
  export type jardinDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jardin
     */
    select?: jardinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jardin
     */
    omit?: jardinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jardinInclude<ExtArgs> | null
  }


  /**
   * Model messagerie
   */

  export type AggregateMessagerie = {
    _count: MessagerieCountAggregateOutputType | null
    _avg: MessagerieAvgAggregateOutputType | null
    _sum: MessagerieSumAggregateOutputType | null
    _min: MessagerieMinAggregateOutputType | null
    _max: MessagerieMaxAggregateOutputType | null
  }

  export type MessagerieAvgAggregateOutputType = {
    id_message: number | null
    id_envoyeur: number | null
    id_destinataire: number | null
  }

  export type MessagerieSumAggregateOutputType = {
    id_message: bigint | null
    id_envoyeur: bigint | null
    id_destinataire: bigint | null
  }

  export type MessagerieMinAggregateOutputType = {
    id_message: bigint | null
    id_envoyeur: bigint | null
    id_destinataire: bigint | null
    contenu: string | null
    date_envoi: Date | null
    lu: boolean | null
  }

  export type MessagerieMaxAggregateOutputType = {
    id_message: bigint | null
    id_envoyeur: bigint | null
    id_destinataire: bigint | null
    contenu: string | null
    date_envoi: Date | null
    lu: boolean | null
  }

  export type MessagerieCountAggregateOutputType = {
    id_message: number
    id_envoyeur: number
    id_destinataire: number
    contenu: number
    date_envoi: number
    lu: number
    _all: number
  }


  export type MessagerieAvgAggregateInputType = {
    id_message?: true
    id_envoyeur?: true
    id_destinataire?: true
  }

  export type MessagerieSumAggregateInputType = {
    id_message?: true
    id_envoyeur?: true
    id_destinataire?: true
  }

  export type MessagerieMinAggregateInputType = {
    id_message?: true
    id_envoyeur?: true
    id_destinataire?: true
    contenu?: true
    date_envoi?: true
    lu?: true
  }

  export type MessagerieMaxAggregateInputType = {
    id_message?: true
    id_envoyeur?: true
    id_destinataire?: true
    contenu?: true
    date_envoi?: true
    lu?: true
  }

  export type MessagerieCountAggregateInputType = {
    id_message?: true
    id_envoyeur?: true
    id_destinataire?: true
    contenu?: true
    date_envoi?: true
    lu?: true
    _all?: true
  }

  export type MessagerieAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which messagerie to aggregate.
     */
    where?: messagerieWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of messageries to fetch.
     */
    orderBy?: messagerieOrderByWithRelationInput | messagerieOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: messagerieWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` messageries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` messageries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned messageries
    **/
    _count?: true | MessagerieCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MessagerieAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MessagerieSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessagerieMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessagerieMaxAggregateInputType
  }

  export type GetMessagerieAggregateType<T extends MessagerieAggregateArgs> = {
        [P in keyof T & keyof AggregateMessagerie]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessagerie[P]>
      : GetScalarType<T[P], AggregateMessagerie[P]>
  }




  export type messagerieGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: messagerieWhereInput
    orderBy?: messagerieOrderByWithAggregationInput | messagerieOrderByWithAggregationInput[]
    by: MessagerieScalarFieldEnum[] | MessagerieScalarFieldEnum
    having?: messagerieScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessagerieCountAggregateInputType | true
    _avg?: MessagerieAvgAggregateInputType
    _sum?: MessagerieSumAggregateInputType
    _min?: MessagerieMinAggregateInputType
    _max?: MessagerieMaxAggregateInputType
  }

  export type MessagerieGroupByOutputType = {
    id_message: bigint
    id_envoyeur: bigint | null
    id_destinataire: bigint | null
    contenu: string | null
    date_envoi: Date | null
    lu: boolean | null
    _count: MessagerieCountAggregateOutputType | null
    _avg: MessagerieAvgAggregateOutputType | null
    _sum: MessagerieSumAggregateOutputType | null
    _min: MessagerieMinAggregateOutputType | null
    _max: MessagerieMaxAggregateOutputType | null
  }

  type GetMessagerieGroupByPayload<T extends messagerieGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessagerieGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessagerieGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessagerieGroupByOutputType[P]>
            : GetScalarType<T[P], MessagerieGroupByOutputType[P]>
        }
      >
    >


  export type messagerieSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_message?: boolean
    id_envoyeur?: boolean
    id_destinataire?: boolean
    contenu?: boolean
    date_envoi?: boolean
    lu?: boolean
    utilisateur_messagerie_id_destinataireToutilisateur?: boolean | messagerie$utilisateur_messagerie_id_destinataireToutilisateurArgs<ExtArgs>
    utilisateur_messagerie_id_envoyeurToutilisateur?: boolean | messagerie$utilisateur_messagerie_id_envoyeurToutilisateurArgs<ExtArgs>
  }, ExtArgs["result"]["messagerie"]>

  export type messagerieSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_message?: boolean
    id_envoyeur?: boolean
    id_destinataire?: boolean
    contenu?: boolean
    date_envoi?: boolean
    lu?: boolean
    utilisateur_messagerie_id_destinataireToutilisateur?: boolean | messagerie$utilisateur_messagerie_id_destinataireToutilisateurArgs<ExtArgs>
    utilisateur_messagerie_id_envoyeurToutilisateur?: boolean | messagerie$utilisateur_messagerie_id_envoyeurToutilisateurArgs<ExtArgs>
  }, ExtArgs["result"]["messagerie"]>

  export type messagerieSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_message?: boolean
    id_envoyeur?: boolean
    id_destinataire?: boolean
    contenu?: boolean
    date_envoi?: boolean
    lu?: boolean
    utilisateur_messagerie_id_destinataireToutilisateur?: boolean | messagerie$utilisateur_messagerie_id_destinataireToutilisateurArgs<ExtArgs>
    utilisateur_messagerie_id_envoyeurToutilisateur?: boolean | messagerie$utilisateur_messagerie_id_envoyeurToutilisateurArgs<ExtArgs>
  }, ExtArgs["result"]["messagerie"]>

  export type messagerieSelectScalar = {
    id_message?: boolean
    id_envoyeur?: boolean
    id_destinataire?: boolean
    contenu?: boolean
    date_envoi?: boolean
    lu?: boolean
  }

  export type messagerieOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id_message" | "id_envoyeur" | "id_destinataire" | "contenu" | "date_envoi" | "lu", ExtArgs["result"]["messagerie"]>
  export type messagerieInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    utilisateur_messagerie_id_destinataireToutilisateur?: boolean | messagerie$utilisateur_messagerie_id_destinataireToutilisateurArgs<ExtArgs>
    utilisateur_messagerie_id_envoyeurToutilisateur?: boolean | messagerie$utilisateur_messagerie_id_envoyeurToutilisateurArgs<ExtArgs>
  }
  export type messagerieIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    utilisateur_messagerie_id_destinataireToutilisateur?: boolean | messagerie$utilisateur_messagerie_id_destinataireToutilisateurArgs<ExtArgs>
    utilisateur_messagerie_id_envoyeurToutilisateur?: boolean | messagerie$utilisateur_messagerie_id_envoyeurToutilisateurArgs<ExtArgs>
  }
  export type messagerieIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    utilisateur_messagerie_id_destinataireToutilisateur?: boolean | messagerie$utilisateur_messagerie_id_destinataireToutilisateurArgs<ExtArgs>
    utilisateur_messagerie_id_envoyeurToutilisateur?: boolean | messagerie$utilisateur_messagerie_id_envoyeurToutilisateurArgs<ExtArgs>
  }

  export type $messageriePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "messagerie"
    objects: {
      utilisateur_messagerie_id_destinataireToutilisateur: Prisma.$utilisateurPayload<ExtArgs> | null
      utilisateur_messagerie_id_envoyeurToutilisateur: Prisma.$utilisateurPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id_message: bigint
      id_envoyeur: bigint | null
      id_destinataire: bigint | null
      contenu: string | null
      date_envoi: Date | null
      lu: boolean | null
    }, ExtArgs["result"]["messagerie"]>
    composites: {}
  }

  type messagerieGetPayload<S extends boolean | null | undefined | messagerieDefaultArgs> = $Result.GetResult<Prisma.$messageriePayload, S>

  type messagerieCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<messagerieFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MessagerieCountAggregateInputType | true
    }

  export interface messagerieDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['messagerie'], meta: { name: 'messagerie' } }
    /**
     * Find zero or one Messagerie that matches the filter.
     * @param {messagerieFindUniqueArgs} args - Arguments to find a Messagerie
     * @example
     * // Get one Messagerie
     * const messagerie = await prisma.messagerie.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends messagerieFindUniqueArgs>(args: SelectSubset<T, messagerieFindUniqueArgs<ExtArgs>>): Prisma__messagerieClient<$Result.GetResult<Prisma.$messageriePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Messagerie that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {messagerieFindUniqueOrThrowArgs} args - Arguments to find a Messagerie
     * @example
     * // Get one Messagerie
     * const messagerie = await prisma.messagerie.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends messagerieFindUniqueOrThrowArgs>(args: SelectSubset<T, messagerieFindUniqueOrThrowArgs<ExtArgs>>): Prisma__messagerieClient<$Result.GetResult<Prisma.$messageriePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Messagerie that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagerieFindFirstArgs} args - Arguments to find a Messagerie
     * @example
     * // Get one Messagerie
     * const messagerie = await prisma.messagerie.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends messagerieFindFirstArgs>(args?: SelectSubset<T, messagerieFindFirstArgs<ExtArgs>>): Prisma__messagerieClient<$Result.GetResult<Prisma.$messageriePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Messagerie that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagerieFindFirstOrThrowArgs} args - Arguments to find a Messagerie
     * @example
     * // Get one Messagerie
     * const messagerie = await prisma.messagerie.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends messagerieFindFirstOrThrowArgs>(args?: SelectSubset<T, messagerieFindFirstOrThrowArgs<ExtArgs>>): Prisma__messagerieClient<$Result.GetResult<Prisma.$messageriePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Messageries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagerieFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messageries
     * const messageries = await prisma.messagerie.findMany()
     * 
     * // Get first 10 Messageries
     * const messageries = await prisma.messagerie.findMany({ take: 10 })
     * 
     * // Only select the `id_message`
     * const messagerieWithId_messageOnly = await prisma.messagerie.findMany({ select: { id_message: true } })
     * 
     */
    findMany<T extends messagerieFindManyArgs>(args?: SelectSubset<T, messagerieFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$messageriePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Messagerie.
     * @param {messagerieCreateArgs} args - Arguments to create a Messagerie.
     * @example
     * // Create one Messagerie
     * const Messagerie = await prisma.messagerie.create({
     *   data: {
     *     // ... data to create a Messagerie
     *   }
     * })
     * 
     */
    create<T extends messagerieCreateArgs>(args: SelectSubset<T, messagerieCreateArgs<ExtArgs>>): Prisma__messagerieClient<$Result.GetResult<Prisma.$messageriePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Messageries.
     * @param {messagerieCreateManyArgs} args - Arguments to create many Messageries.
     * @example
     * // Create many Messageries
     * const messagerie = await prisma.messagerie.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends messagerieCreateManyArgs>(args?: SelectSubset<T, messagerieCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Messageries and returns the data saved in the database.
     * @param {messagerieCreateManyAndReturnArgs} args - Arguments to create many Messageries.
     * @example
     * // Create many Messageries
     * const messagerie = await prisma.messagerie.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Messageries and only return the `id_message`
     * const messagerieWithId_messageOnly = await prisma.messagerie.createManyAndReturn({
     *   select: { id_message: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends messagerieCreateManyAndReturnArgs>(args?: SelectSubset<T, messagerieCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$messageriePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Messagerie.
     * @param {messagerieDeleteArgs} args - Arguments to delete one Messagerie.
     * @example
     * // Delete one Messagerie
     * const Messagerie = await prisma.messagerie.delete({
     *   where: {
     *     // ... filter to delete one Messagerie
     *   }
     * })
     * 
     */
    delete<T extends messagerieDeleteArgs>(args: SelectSubset<T, messagerieDeleteArgs<ExtArgs>>): Prisma__messagerieClient<$Result.GetResult<Prisma.$messageriePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Messagerie.
     * @param {messagerieUpdateArgs} args - Arguments to update one Messagerie.
     * @example
     * // Update one Messagerie
     * const messagerie = await prisma.messagerie.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends messagerieUpdateArgs>(args: SelectSubset<T, messagerieUpdateArgs<ExtArgs>>): Prisma__messagerieClient<$Result.GetResult<Prisma.$messageriePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Messageries.
     * @param {messagerieDeleteManyArgs} args - Arguments to filter Messageries to delete.
     * @example
     * // Delete a few Messageries
     * const { count } = await prisma.messagerie.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends messagerieDeleteManyArgs>(args?: SelectSubset<T, messagerieDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messageries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagerieUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messageries
     * const messagerie = await prisma.messagerie.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends messagerieUpdateManyArgs>(args: SelectSubset<T, messagerieUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messageries and returns the data updated in the database.
     * @param {messagerieUpdateManyAndReturnArgs} args - Arguments to update many Messageries.
     * @example
     * // Update many Messageries
     * const messagerie = await prisma.messagerie.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Messageries and only return the `id_message`
     * const messagerieWithId_messageOnly = await prisma.messagerie.updateManyAndReturn({
     *   select: { id_message: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends messagerieUpdateManyAndReturnArgs>(args: SelectSubset<T, messagerieUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$messageriePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Messagerie.
     * @param {messagerieUpsertArgs} args - Arguments to update or create a Messagerie.
     * @example
     * // Update or create a Messagerie
     * const messagerie = await prisma.messagerie.upsert({
     *   create: {
     *     // ... data to create a Messagerie
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Messagerie we want to update
     *   }
     * })
     */
    upsert<T extends messagerieUpsertArgs>(args: SelectSubset<T, messagerieUpsertArgs<ExtArgs>>): Prisma__messagerieClient<$Result.GetResult<Prisma.$messageriePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Messageries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagerieCountArgs} args - Arguments to filter Messageries to count.
     * @example
     * // Count the number of Messageries
     * const count = await prisma.messagerie.count({
     *   where: {
     *     // ... the filter for the Messageries we want to count
     *   }
     * })
    **/
    count<T extends messagerieCountArgs>(
      args?: Subset<T, messagerieCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessagerieCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Messagerie.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessagerieAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessagerieAggregateArgs>(args: Subset<T, MessagerieAggregateArgs>): Prisma.PrismaPromise<GetMessagerieAggregateType<T>>

    /**
     * Group by Messagerie.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagerieGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends messagerieGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: messagerieGroupByArgs['orderBy'] }
        : { orderBy?: messagerieGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, messagerieGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessagerieGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the messagerie model
   */
  readonly fields: messagerieFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for messagerie.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__messagerieClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    utilisateur_messagerie_id_destinataireToutilisateur<T extends messagerie$utilisateur_messagerie_id_destinataireToutilisateurArgs<ExtArgs> = {}>(args?: Subset<T, messagerie$utilisateur_messagerie_id_destinataireToutilisateurArgs<ExtArgs>>): Prisma__utilisateurClient<$Result.GetResult<Prisma.$utilisateurPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    utilisateur_messagerie_id_envoyeurToutilisateur<T extends messagerie$utilisateur_messagerie_id_envoyeurToutilisateurArgs<ExtArgs> = {}>(args?: Subset<T, messagerie$utilisateur_messagerie_id_envoyeurToutilisateurArgs<ExtArgs>>): Prisma__utilisateurClient<$Result.GetResult<Prisma.$utilisateurPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the messagerie model
   */
  interface messagerieFieldRefs {
    readonly id_message: FieldRef<"messagerie", 'BigInt'>
    readonly id_envoyeur: FieldRef<"messagerie", 'BigInt'>
    readonly id_destinataire: FieldRef<"messagerie", 'BigInt'>
    readonly contenu: FieldRef<"messagerie", 'String'>
    readonly date_envoi: FieldRef<"messagerie", 'DateTime'>
    readonly lu: FieldRef<"messagerie", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * messagerie findUnique
   */
  export type messagerieFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messagerie
     */
    select?: messagerieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messagerie
     */
    omit?: messagerieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagerieInclude<ExtArgs> | null
    /**
     * Filter, which messagerie to fetch.
     */
    where: messagerieWhereUniqueInput
  }

  /**
   * messagerie findUniqueOrThrow
   */
  export type messagerieFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messagerie
     */
    select?: messagerieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messagerie
     */
    omit?: messagerieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagerieInclude<ExtArgs> | null
    /**
     * Filter, which messagerie to fetch.
     */
    where: messagerieWhereUniqueInput
  }

  /**
   * messagerie findFirst
   */
  export type messagerieFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messagerie
     */
    select?: messagerieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messagerie
     */
    omit?: messagerieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagerieInclude<ExtArgs> | null
    /**
     * Filter, which messagerie to fetch.
     */
    where?: messagerieWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of messageries to fetch.
     */
    orderBy?: messagerieOrderByWithRelationInput | messagerieOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for messageries.
     */
    cursor?: messagerieWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` messageries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` messageries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of messageries.
     */
    distinct?: MessagerieScalarFieldEnum | MessagerieScalarFieldEnum[]
  }

  /**
   * messagerie findFirstOrThrow
   */
  export type messagerieFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messagerie
     */
    select?: messagerieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messagerie
     */
    omit?: messagerieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagerieInclude<ExtArgs> | null
    /**
     * Filter, which messagerie to fetch.
     */
    where?: messagerieWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of messageries to fetch.
     */
    orderBy?: messagerieOrderByWithRelationInput | messagerieOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for messageries.
     */
    cursor?: messagerieWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` messageries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` messageries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of messageries.
     */
    distinct?: MessagerieScalarFieldEnum | MessagerieScalarFieldEnum[]
  }

  /**
   * messagerie findMany
   */
  export type messagerieFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messagerie
     */
    select?: messagerieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messagerie
     */
    omit?: messagerieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagerieInclude<ExtArgs> | null
    /**
     * Filter, which messageries to fetch.
     */
    where?: messagerieWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of messageries to fetch.
     */
    orderBy?: messagerieOrderByWithRelationInput | messagerieOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing messageries.
     */
    cursor?: messagerieWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` messageries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` messageries.
     */
    skip?: number
    distinct?: MessagerieScalarFieldEnum | MessagerieScalarFieldEnum[]
  }

  /**
   * messagerie create
   */
  export type messagerieCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messagerie
     */
    select?: messagerieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messagerie
     */
    omit?: messagerieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagerieInclude<ExtArgs> | null
    /**
     * The data needed to create a messagerie.
     */
    data?: XOR<messagerieCreateInput, messagerieUncheckedCreateInput>
  }

  /**
   * messagerie createMany
   */
  export type messagerieCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many messageries.
     */
    data: messagerieCreateManyInput | messagerieCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * messagerie createManyAndReturn
   */
  export type messagerieCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messagerie
     */
    select?: messagerieSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the messagerie
     */
    omit?: messagerieOmit<ExtArgs> | null
    /**
     * The data used to create many messageries.
     */
    data: messagerieCreateManyInput | messagerieCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagerieIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * messagerie update
   */
  export type messagerieUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messagerie
     */
    select?: messagerieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messagerie
     */
    omit?: messagerieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagerieInclude<ExtArgs> | null
    /**
     * The data needed to update a messagerie.
     */
    data: XOR<messagerieUpdateInput, messagerieUncheckedUpdateInput>
    /**
     * Choose, which messagerie to update.
     */
    where: messagerieWhereUniqueInput
  }

  /**
   * messagerie updateMany
   */
  export type messagerieUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update messageries.
     */
    data: XOR<messagerieUpdateManyMutationInput, messagerieUncheckedUpdateManyInput>
    /**
     * Filter which messageries to update
     */
    where?: messagerieWhereInput
    /**
     * Limit how many messageries to update.
     */
    limit?: number
  }

  /**
   * messagerie updateManyAndReturn
   */
  export type messagerieUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messagerie
     */
    select?: messagerieSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the messagerie
     */
    omit?: messagerieOmit<ExtArgs> | null
    /**
     * The data used to update messageries.
     */
    data: XOR<messagerieUpdateManyMutationInput, messagerieUncheckedUpdateManyInput>
    /**
     * Filter which messageries to update
     */
    where?: messagerieWhereInput
    /**
     * Limit how many messageries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagerieIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * messagerie upsert
   */
  export type messagerieUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messagerie
     */
    select?: messagerieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messagerie
     */
    omit?: messagerieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagerieInclude<ExtArgs> | null
    /**
     * The filter to search for the messagerie to update in case it exists.
     */
    where: messagerieWhereUniqueInput
    /**
     * In case the messagerie found by the `where` argument doesn't exist, create a new messagerie with this data.
     */
    create: XOR<messagerieCreateInput, messagerieUncheckedCreateInput>
    /**
     * In case the messagerie was found with the provided `where` argument, update it with this data.
     */
    update: XOR<messagerieUpdateInput, messagerieUncheckedUpdateInput>
  }

  /**
   * messagerie delete
   */
  export type messagerieDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messagerie
     */
    select?: messagerieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messagerie
     */
    omit?: messagerieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagerieInclude<ExtArgs> | null
    /**
     * Filter which messagerie to delete.
     */
    where: messagerieWhereUniqueInput
  }

  /**
   * messagerie deleteMany
   */
  export type messagerieDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which messageries to delete
     */
    where?: messagerieWhereInput
    /**
     * Limit how many messageries to delete.
     */
    limit?: number
  }

  /**
   * messagerie.utilisateur_messagerie_id_destinataireToutilisateur
   */
  export type messagerie$utilisateur_messagerie_id_destinataireToutilisateurArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateur
     */
    select?: utilisateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateur
     */
    omit?: utilisateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurInclude<ExtArgs> | null
    where?: utilisateurWhereInput
  }

  /**
   * messagerie.utilisateur_messagerie_id_envoyeurToutilisateur
   */
  export type messagerie$utilisateur_messagerie_id_envoyeurToutilisateurArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateur
     */
    select?: utilisateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateur
     */
    omit?: utilisateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurInclude<ExtArgs> | null
    where?: utilisateurWhereInput
  }

  /**
   * messagerie without action
   */
  export type messagerieDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messagerie
     */
    select?: messagerieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messagerie
     */
    omit?: messagerieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagerieInclude<ExtArgs> | null
  }


  /**
   * Model reservation
   */

  export type AggregateReservation = {
    _count: ReservationCountAggregateOutputType | null
    _avg: ReservationAvgAggregateOutputType | null
    _sum: ReservationSumAggregateOutputType | null
    _min: ReservationMinAggregateOutputType | null
    _max: ReservationMaxAggregateOutputType | null
  }

  export type ReservationAvgAggregateOutputType = {
    id_reservation: number | null
    id_utilisateur: number | null
    id_jardin: number | null
    id_disponibilite: number | null
  }

  export type ReservationSumAggregateOutputType = {
    id_reservation: bigint | null
    id_utilisateur: bigint | null
    id_jardin: bigint | null
    id_disponibilite: bigint | null
  }

  export type ReservationMinAggregateOutputType = {
    id_reservation: bigint | null
    id_utilisateur: bigint | null
    id_jardin: bigint | null
    id_disponibilite: bigint | null
    statut: string | null
    date_reservation: Date | null
    commentaires: string | null
  }

  export type ReservationMaxAggregateOutputType = {
    id_reservation: bigint | null
    id_utilisateur: bigint | null
    id_jardin: bigint | null
    id_disponibilite: bigint | null
    statut: string | null
    date_reservation: Date | null
    commentaires: string | null
  }

  export type ReservationCountAggregateOutputType = {
    id_reservation: number
    id_utilisateur: number
    id_jardin: number
    id_disponibilite: number
    statut: number
    date_reservation: number
    commentaires: number
    _all: number
  }


  export type ReservationAvgAggregateInputType = {
    id_reservation?: true
    id_utilisateur?: true
    id_jardin?: true
    id_disponibilite?: true
  }

  export type ReservationSumAggregateInputType = {
    id_reservation?: true
    id_utilisateur?: true
    id_jardin?: true
    id_disponibilite?: true
  }

  export type ReservationMinAggregateInputType = {
    id_reservation?: true
    id_utilisateur?: true
    id_jardin?: true
    id_disponibilite?: true
    statut?: true
    date_reservation?: true
    commentaires?: true
  }

  export type ReservationMaxAggregateInputType = {
    id_reservation?: true
    id_utilisateur?: true
    id_jardin?: true
    id_disponibilite?: true
    statut?: true
    date_reservation?: true
    commentaires?: true
  }

  export type ReservationCountAggregateInputType = {
    id_reservation?: true
    id_utilisateur?: true
    id_jardin?: true
    id_disponibilite?: true
    statut?: true
    date_reservation?: true
    commentaires?: true
    _all?: true
  }

  export type ReservationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which reservation to aggregate.
     */
    where?: reservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reservations to fetch.
     */
    orderBy?: reservationOrderByWithRelationInput | reservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: reservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned reservations
    **/
    _count?: true | ReservationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReservationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReservationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReservationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReservationMaxAggregateInputType
  }

  export type GetReservationAggregateType<T extends ReservationAggregateArgs> = {
        [P in keyof T & keyof AggregateReservation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReservation[P]>
      : GetScalarType<T[P], AggregateReservation[P]>
  }




  export type reservationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: reservationWhereInput
    orderBy?: reservationOrderByWithAggregationInput | reservationOrderByWithAggregationInput[]
    by: ReservationScalarFieldEnum[] | ReservationScalarFieldEnum
    having?: reservationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReservationCountAggregateInputType | true
    _avg?: ReservationAvgAggregateInputType
    _sum?: ReservationSumAggregateInputType
    _min?: ReservationMinAggregateInputType
    _max?: ReservationMaxAggregateInputType
  }

  export type ReservationGroupByOutputType = {
    id_reservation: bigint
    id_utilisateur: bigint | null
    id_jardin: bigint | null
    id_disponibilite: bigint | null
    statut: string | null
    date_reservation: Date | null
    commentaires: string | null
    _count: ReservationCountAggregateOutputType | null
    _avg: ReservationAvgAggregateOutputType | null
    _sum: ReservationSumAggregateOutputType | null
    _min: ReservationMinAggregateOutputType | null
    _max: ReservationMaxAggregateOutputType | null
  }

  type GetReservationGroupByPayload<T extends reservationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReservationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReservationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReservationGroupByOutputType[P]>
            : GetScalarType<T[P], ReservationGroupByOutputType[P]>
        }
      >
    >


  export type reservationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_reservation?: boolean
    id_utilisateur?: boolean
    id_jardin?: boolean
    id_disponibilite?: boolean
    statut?: boolean
    date_reservation?: boolean
    commentaires?: boolean
    disponibilites?: boolean | reservation$disponibilitesArgs<ExtArgs>
    jardin?: boolean | reservation$jardinArgs<ExtArgs>
    utilisateur?: boolean | reservation$utilisateurArgs<ExtArgs>
  }, ExtArgs["result"]["reservation"]>

  export type reservationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_reservation?: boolean
    id_utilisateur?: boolean
    id_jardin?: boolean
    id_disponibilite?: boolean
    statut?: boolean
    date_reservation?: boolean
    commentaires?: boolean
    disponibilites?: boolean | reservation$disponibilitesArgs<ExtArgs>
    jardin?: boolean | reservation$jardinArgs<ExtArgs>
    utilisateur?: boolean | reservation$utilisateurArgs<ExtArgs>
  }, ExtArgs["result"]["reservation"]>

  export type reservationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_reservation?: boolean
    id_utilisateur?: boolean
    id_jardin?: boolean
    id_disponibilite?: boolean
    statut?: boolean
    date_reservation?: boolean
    commentaires?: boolean
    disponibilites?: boolean | reservation$disponibilitesArgs<ExtArgs>
    jardin?: boolean | reservation$jardinArgs<ExtArgs>
    utilisateur?: boolean | reservation$utilisateurArgs<ExtArgs>
  }, ExtArgs["result"]["reservation"]>

  export type reservationSelectScalar = {
    id_reservation?: boolean
    id_utilisateur?: boolean
    id_jardin?: boolean
    id_disponibilite?: boolean
    statut?: boolean
    date_reservation?: boolean
    commentaires?: boolean
  }

  export type reservationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id_reservation" | "id_utilisateur" | "id_jardin" | "id_disponibilite" | "statut" | "date_reservation" | "commentaires", ExtArgs["result"]["reservation"]>
  export type reservationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    disponibilites?: boolean | reservation$disponibilitesArgs<ExtArgs>
    jardin?: boolean | reservation$jardinArgs<ExtArgs>
    utilisateur?: boolean | reservation$utilisateurArgs<ExtArgs>
  }
  export type reservationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    disponibilites?: boolean | reservation$disponibilitesArgs<ExtArgs>
    jardin?: boolean | reservation$jardinArgs<ExtArgs>
    utilisateur?: boolean | reservation$utilisateurArgs<ExtArgs>
  }
  export type reservationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    disponibilites?: boolean | reservation$disponibilitesArgs<ExtArgs>
    jardin?: boolean | reservation$jardinArgs<ExtArgs>
    utilisateur?: boolean | reservation$utilisateurArgs<ExtArgs>
  }

  export type $reservationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "reservation"
    objects: {
      disponibilites: Prisma.$disponibilitesPayload<ExtArgs> | null
      jardin: Prisma.$jardinPayload<ExtArgs> | null
      utilisateur: Prisma.$utilisateurPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id_reservation: bigint
      id_utilisateur: bigint | null
      id_jardin: bigint | null
      id_disponibilite: bigint | null
      statut: string | null
      date_reservation: Date | null
      commentaires: string | null
    }, ExtArgs["result"]["reservation"]>
    composites: {}
  }

  type reservationGetPayload<S extends boolean | null | undefined | reservationDefaultArgs> = $Result.GetResult<Prisma.$reservationPayload, S>

  type reservationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<reservationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReservationCountAggregateInputType | true
    }

  export interface reservationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['reservation'], meta: { name: 'reservation' } }
    /**
     * Find zero or one Reservation that matches the filter.
     * @param {reservationFindUniqueArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends reservationFindUniqueArgs>(args: SelectSubset<T, reservationFindUniqueArgs<ExtArgs>>): Prisma__reservationClient<$Result.GetResult<Prisma.$reservationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Reservation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {reservationFindUniqueOrThrowArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends reservationFindUniqueOrThrowArgs>(args: SelectSubset<T, reservationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__reservationClient<$Result.GetResult<Prisma.$reservationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reservation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reservationFindFirstArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends reservationFindFirstArgs>(args?: SelectSubset<T, reservationFindFirstArgs<ExtArgs>>): Prisma__reservationClient<$Result.GetResult<Prisma.$reservationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reservation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reservationFindFirstOrThrowArgs} args - Arguments to find a Reservation
     * @example
     * // Get one Reservation
     * const reservation = await prisma.reservation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends reservationFindFirstOrThrowArgs>(args?: SelectSubset<T, reservationFindFirstOrThrowArgs<ExtArgs>>): Prisma__reservationClient<$Result.GetResult<Prisma.$reservationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reservations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reservationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reservations
     * const reservations = await prisma.reservation.findMany()
     * 
     * // Get first 10 Reservations
     * const reservations = await prisma.reservation.findMany({ take: 10 })
     * 
     * // Only select the `id_reservation`
     * const reservationWithId_reservationOnly = await prisma.reservation.findMany({ select: { id_reservation: true } })
     * 
     */
    findMany<T extends reservationFindManyArgs>(args?: SelectSubset<T, reservationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reservationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Reservation.
     * @param {reservationCreateArgs} args - Arguments to create a Reservation.
     * @example
     * // Create one Reservation
     * const Reservation = await prisma.reservation.create({
     *   data: {
     *     // ... data to create a Reservation
     *   }
     * })
     * 
     */
    create<T extends reservationCreateArgs>(args: SelectSubset<T, reservationCreateArgs<ExtArgs>>): Prisma__reservationClient<$Result.GetResult<Prisma.$reservationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reservations.
     * @param {reservationCreateManyArgs} args - Arguments to create many Reservations.
     * @example
     * // Create many Reservations
     * const reservation = await prisma.reservation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends reservationCreateManyArgs>(args?: SelectSubset<T, reservationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reservations and returns the data saved in the database.
     * @param {reservationCreateManyAndReturnArgs} args - Arguments to create many Reservations.
     * @example
     * // Create many Reservations
     * const reservation = await prisma.reservation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reservations and only return the `id_reservation`
     * const reservationWithId_reservationOnly = await prisma.reservation.createManyAndReturn({
     *   select: { id_reservation: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends reservationCreateManyAndReturnArgs>(args?: SelectSubset<T, reservationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reservationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Reservation.
     * @param {reservationDeleteArgs} args - Arguments to delete one Reservation.
     * @example
     * // Delete one Reservation
     * const Reservation = await prisma.reservation.delete({
     *   where: {
     *     // ... filter to delete one Reservation
     *   }
     * })
     * 
     */
    delete<T extends reservationDeleteArgs>(args: SelectSubset<T, reservationDeleteArgs<ExtArgs>>): Prisma__reservationClient<$Result.GetResult<Prisma.$reservationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Reservation.
     * @param {reservationUpdateArgs} args - Arguments to update one Reservation.
     * @example
     * // Update one Reservation
     * const reservation = await prisma.reservation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends reservationUpdateArgs>(args: SelectSubset<T, reservationUpdateArgs<ExtArgs>>): Prisma__reservationClient<$Result.GetResult<Prisma.$reservationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reservations.
     * @param {reservationDeleteManyArgs} args - Arguments to filter Reservations to delete.
     * @example
     * // Delete a few Reservations
     * const { count } = await prisma.reservation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends reservationDeleteManyArgs>(args?: SelectSubset<T, reservationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reservationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reservations
     * const reservation = await prisma.reservation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends reservationUpdateManyArgs>(args: SelectSubset<T, reservationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reservations and returns the data updated in the database.
     * @param {reservationUpdateManyAndReturnArgs} args - Arguments to update many Reservations.
     * @example
     * // Update many Reservations
     * const reservation = await prisma.reservation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Reservations and only return the `id_reservation`
     * const reservationWithId_reservationOnly = await prisma.reservation.updateManyAndReturn({
     *   select: { id_reservation: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends reservationUpdateManyAndReturnArgs>(args: SelectSubset<T, reservationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reservationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Reservation.
     * @param {reservationUpsertArgs} args - Arguments to update or create a Reservation.
     * @example
     * // Update or create a Reservation
     * const reservation = await prisma.reservation.upsert({
     *   create: {
     *     // ... data to create a Reservation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reservation we want to update
     *   }
     * })
     */
    upsert<T extends reservationUpsertArgs>(args: SelectSubset<T, reservationUpsertArgs<ExtArgs>>): Prisma__reservationClient<$Result.GetResult<Prisma.$reservationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reservationCountArgs} args - Arguments to filter Reservations to count.
     * @example
     * // Count the number of Reservations
     * const count = await prisma.reservation.count({
     *   where: {
     *     // ... the filter for the Reservations we want to count
     *   }
     * })
    **/
    count<T extends reservationCountArgs>(
      args?: Subset<T, reservationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReservationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReservationAggregateArgs>(args: Subset<T, ReservationAggregateArgs>): Prisma.PrismaPromise<GetReservationAggregateType<T>>

    /**
     * Group by Reservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reservationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends reservationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: reservationGroupByArgs['orderBy'] }
        : { orderBy?: reservationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, reservationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReservationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the reservation model
   */
  readonly fields: reservationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for reservation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__reservationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    disponibilites<T extends reservation$disponibilitesArgs<ExtArgs> = {}>(args?: Subset<T, reservation$disponibilitesArgs<ExtArgs>>): Prisma__disponibilitesClient<$Result.GetResult<Prisma.$disponibilitesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    jardin<T extends reservation$jardinArgs<ExtArgs> = {}>(args?: Subset<T, reservation$jardinArgs<ExtArgs>>): Prisma__jardinClient<$Result.GetResult<Prisma.$jardinPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    utilisateur<T extends reservation$utilisateurArgs<ExtArgs> = {}>(args?: Subset<T, reservation$utilisateurArgs<ExtArgs>>): Prisma__utilisateurClient<$Result.GetResult<Prisma.$utilisateurPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the reservation model
   */
  interface reservationFieldRefs {
    readonly id_reservation: FieldRef<"reservation", 'BigInt'>
    readonly id_utilisateur: FieldRef<"reservation", 'BigInt'>
    readonly id_jardin: FieldRef<"reservation", 'BigInt'>
    readonly id_disponibilite: FieldRef<"reservation", 'BigInt'>
    readonly statut: FieldRef<"reservation", 'String'>
    readonly date_reservation: FieldRef<"reservation", 'DateTime'>
    readonly commentaires: FieldRef<"reservation", 'String'>
  }
    

  // Custom InputTypes
  /**
   * reservation findUnique
   */
  export type reservationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reservation
     */
    select?: reservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reservation
     */
    omit?: reservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reservationInclude<ExtArgs> | null
    /**
     * Filter, which reservation to fetch.
     */
    where: reservationWhereUniqueInput
  }

  /**
   * reservation findUniqueOrThrow
   */
  export type reservationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reservation
     */
    select?: reservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reservation
     */
    omit?: reservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reservationInclude<ExtArgs> | null
    /**
     * Filter, which reservation to fetch.
     */
    where: reservationWhereUniqueInput
  }

  /**
   * reservation findFirst
   */
  export type reservationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reservation
     */
    select?: reservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reservation
     */
    omit?: reservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reservationInclude<ExtArgs> | null
    /**
     * Filter, which reservation to fetch.
     */
    where?: reservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reservations to fetch.
     */
    orderBy?: reservationOrderByWithRelationInput | reservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for reservations.
     */
    cursor?: reservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of reservations.
     */
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * reservation findFirstOrThrow
   */
  export type reservationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reservation
     */
    select?: reservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reservation
     */
    omit?: reservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reservationInclude<ExtArgs> | null
    /**
     * Filter, which reservation to fetch.
     */
    where?: reservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reservations to fetch.
     */
    orderBy?: reservationOrderByWithRelationInput | reservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for reservations.
     */
    cursor?: reservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of reservations.
     */
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * reservation findMany
   */
  export type reservationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reservation
     */
    select?: reservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reservation
     */
    omit?: reservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reservationInclude<ExtArgs> | null
    /**
     * Filter, which reservations to fetch.
     */
    where?: reservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reservations to fetch.
     */
    orderBy?: reservationOrderByWithRelationInput | reservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing reservations.
     */
    cursor?: reservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reservations.
     */
    skip?: number
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * reservation create
   */
  export type reservationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reservation
     */
    select?: reservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reservation
     */
    omit?: reservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reservationInclude<ExtArgs> | null
    /**
     * The data needed to create a reservation.
     */
    data?: XOR<reservationCreateInput, reservationUncheckedCreateInput>
  }

  /**
   * reservation createMany
   */
  export type reservationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many reservations.
     */
    data: reservationCreateManyInput | reservationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * reservation createManyAndReturn
   */
  export type reservationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reservation
     */
    select?: reservationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the reservation
     */
    omit?: reservationOmit<ExtArgs> | null
    /**
     * The data used to create many reservations.
     */
    data: reservationCreateManyInput | reservationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reservationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * reservation update
   */
  export type reservationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reservation
     */
    select?: reservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reservation
     */
    omit?: reservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reservationInclude<ExtArgs> | null
    /**
     * The data needed to update a reservation.
     */
    data: XOR<reservationUpdateInput, reservationUncheckedUpdateInput>
    /**
     * Choose, which reservation to update.
     */
    where: reservationWhereUniqueInput
  }

  /**
   * reservation updateMany
   */
  export type reservationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update reservations.
     */
    data: XOR<reservationUpdateManyMutationInput, reservationUncheckedUpdateManyInput>
    /**
     * Filter which reservations to update
     */
    where?: reservationWhereInput
    /**
     * Limit how many reservations to update.
     */
    limit?: number
  }

  /**
   * reservation updateManyAndReturn
   */
  export type reservationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reservation
     */
    select?: reservationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the reservation
     */
    omit?: reservationOmit<ExtArgs> | null
    /**
     * The data used to update reservations.
     */
    data: XOR<reservationUpdateManyMutationInput, reservationUncheckedUpdateManyInput>
    /**
     * Filter which reservations to update
     */
    where?: reservationWhereInput
    /**
     * Limit how many reservations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reservationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * reservation upsert
   */
  export type reservationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reservation
     */
    select?: reservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reservation
     */
    omit?: reservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reservationInclude<ExtArgs> | null
    /**
     * The filter to search for the reservation to update in case it exists.
     */
    where: reservationWhereUniqueInput
    /**
     * In case the reservation found by the `where` argument doesn't exist, create a new reservation with this data.
     */
    create: XOR<reservationCreateInput, reservationUncheckedCreateInput>
    /**
     * In case the reservation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<reservationUpdateInput, reservationUncheckedUpdateInput>
  }

  /**
   * reservation delete
   */
  export type reservationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reservation
     */
    select?: reservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reservation
     */
    omit?: reservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reservationInclude<ExtArgs> | null
    /**
     * Filter which reservation to delete.
     */
    where: reservationWhereUniqueInput
  }

  /**
   * reservation deleteMany
   */
  export type reservationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which reservations to delete
     */
    where?: reservationWhereInput
    /**
     * Limit how many reservations to delete.
     */
    limit?: number
  }

  /**
   * reservation.disponibilites
   */
  export type reservation$disponibilitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the disponibilites
     */
    select?: disponibilitesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the disponibilites
     */
    omit?: disponibilitesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: disponibilitesInclude<ExtArgs> | null
    where?: disponibilitesWhereInput
  }

  /**
   * reservation.jardin
   */
  export type reservation$jardinArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jardin
     */
    select?: jardinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jardin
     */
    omit?: jardinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jardinInclude<ExtArgs> | null
    where?: jardinWhereInput
  }

  /**
   * reservation.utilisateur
   */
  export type reservation$utilisateurArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateur
     */
    select?: utilisateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateur
     */
    omit?: utilisateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurInclude<ExtArgs> | null
    where?: utilisateurWhereInput
  }

  /**
   * reservation without action
   */
  export type reservationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reservation
     */
    select?: reservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reservation
     */
    omit?: reservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reservationInclude<ExtArgs> | null
  }


  /**
   * Model utilisateur
   */

  export type AggregateUtilisateur = {
    _count: UtilisateurCountAggregateOutputType | null
    _avg: UtilisateurAvgAggregateOutputType | null
    _sum: UtilisateurSumAggregateOutputType | null
    _min: UtilisateurMinAggregateOutputType | null
    _max: UtilisateurMaxAggregateOutputType | null
  }

  export type UtilisateurAvgAggregateOutputType = {
    id_utilisateur: number | null
    note_moyenne: number | null
  }

  export type UtilisateurSumAggregateOutputType = {
    id_utilisateur: bigint | null
    note_moyenne: number | null
  }

  export type UtilisateurMinAggregateOutputType = {
    id_utilisateur: bigint | null
    prenom: string | null
    nom: string | null
    email: string | null
    mot_de_passe: string | null
    role: string | null
    photo_profil: string | null
    biographie: string | null
    date_inscription: Date | null
    telephone: string | null
    adresse: string | null
    note_moyenne: number | null
  }

  export type UtilisateurMaxAggregateOutputType = {
    id_utilisateur: bigint | null
    prenom: string | null
    nom: string | null
    email: string | null
    mot_de_passe: string | null
    role: string | null
    photo_profil: string | null
    biographie: string | null
    date_inscription: Date | null
    telephone: string | null
    adresse: string | null
    note_moyenne: number | null
  }

  export type UtilisateurCountAggregateOutputType = {
    id_utilisateur: number
    prenom: number
    nom: number
    email: number
    mot_de_passe: number
    role: number
    photo_profil: number
    biographie: number
    date_inscription: number
    telephone: number
    adresse: number
    note_moyenne: number
    _all: number
  }


  export type UtilisateurAvgAggregateInputType = {
    id_utilisateur?: true
    note_moyenne?: true
  }

  export type UtilisateurSumAggregateInputType = {
    id_utilisateur?: true
    note_moyenne?: true
  }

  export type UtilisateurMinAggregateInputType = {
    id_utilisateur?: true
    prenom?: true
    nom?: true
    email?: true
    mot_de_passe?: true
    role?: true
    photo_profil?: true
    biographie?: true
    date_inscription?: true
    telephone?: true
    adresse?: true
    note_moyenne?: true
  }

  export type UtilisateurMaxAggregateInputType = {
    id_utilisateur?: true
    prenom?: true
    nom?: true
    email?: true
    mot_de_passe?: true
    role?: true
    photo_profil?: true
    biographie?: true
    date_inscription?: true
    telephone?: true
    adresse?: true
    note_moyenne?: true
  }

  export type UtilisateurCountAggregateInputType = {
    id_utilisateur?: true
    prenom?: true
    nom?: true
    email?: true
    mot_de_passe?: true
    role?: true
    photo_profil?: true
    biographie?: true
    date_inscription?: true
    telephone?: true
    adresse?: true
    note_moyenne?: true
    _all?: true
  }

  export type UtilisateurAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which utilisateur to aggregate.
     */
    where?: utilisateurWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of utilisateurs to fetch.
     */
    orderBy?: utilisateurOrderByWithRelationInput | utilisateurOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: utilisateurWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` utilisateurs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` utilisateurs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned utilisateurs
    **/
    _count?: true | UtilisateurCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UtilisateurAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UtilisateurSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UtilisateurMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UtilisateurMaxAggregateInputType
  }

  export type GetUtilisateurAggregateType<T extends UtilisateurAggregateArgs> = {
        [P in keyof T & keyof AggregateUtilisateur]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUtilisateur[P]>
      : GetScalarType<T[P], AggregateUtilisateur[P]>
  }




  export type utilisateurGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: utilisateurWhereInput
    orderBy?: utilisateurOrderByWithAggregationInput | utilisateurOrderByWithAggregationInput[]
    by: UtilisateurScalarFieldEnum[] | UtilisateurScalarFieldEnum
    having?: utilisateurScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UtilisateurCountAggregateInputType | true
    _avg?: UtilisateurAvgAggregateInputType
    _sum?: UtilisateurSumAggregateInputType
    _min?: UtilisateurMinAggregateInputType
    _max?: UtilisateurMaxAggregateInputType
  }

  export type UtilisateurGroupByOutputType = {
    id_utilisateur: bigint
    prenom: string | null
    nom: string | null
    email: string | null
    mot_de_passe: string | null
    role: string | null
    photo_profil: string | null
    biographie: string | null
    date_inscription: Date | null
    telephone: string | null
    adresse: string | null
    note_moyenne: number | null
    _count: UtilisateurCountAggregateOutputType | null
    _avg: UtilisateurAvgAggregateOutputType | null
    _sum: UtilisateurSumAggregateOutputType | null
    _min: UtilisateurMinAggregateOutputType | null
    _max: UtilisateurMaxAggregateOutputType | null
  }

  type GetUtilisateurGroupByPayload<T extends utilisateurGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UtilisateurGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UtilisateurGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UtilisateurGroupByOutputType[P]>
            : GetScalarType<T[P], UtilisateurGroupByOutputType[P]>
        }
      >
    >


  export type utilisateurSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_utilisateur?: boolean
    prenom?: boolean
    nom?: boolean
    email?: boolean
    mot_de_passe?: boolean
    role?: boolean
    photo_profil?: boolean
    biographie?: boolean
    date_inscription?: boolean
    telephone?: boolean
    adresse?: boolean
    note_moyenne?: boolean
    avis?: boolean | utilisateur$avisArgs<ExtArgs>
    heurescumul_es?: boolean | utilisateur$heurescumul_esArgs<ExtArgs>
    jardin?: boolean | utilisateur$jardinArgs<ExtArgs>
    messagerie_messagerie_id_destinataireToutilisateur?: boolean | utilisateur$messagerie_messagerie_id_destinataireToutilisateurArgs<ExtArgs>
    messagerie_messagerie_id_envoyeurToutilisateur?: boolean | utilisateur$messagerie_messagerie_id_envoyeurToutilisateurArgs<ExtArgs>
    reservation?: boolean | utilisateur$reservationArgs<ExtArgs>
    competences?: boolean | utilisateur$competencesArgs<ExtArgs>
    _count?: boolean | UtilisateurCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["utilisateur"]>

  export type utilisateurSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_utilisateur?: boolean
    prenom?: boolean
    nom?: boolean
    email?: boolean
    mot_de_passe?: boolean
    role?: boolean
    photo_profil?: boolean
    biographie?: boolean
    date_inscription?: boolean
    telephone?: boolean
    adresse?: boolean
    note_moyenne?: boolean
  }, ExtArgs["result"]["utilisateur"]>

  export type utilisateurSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_utilisateur?: boolean
    prenom?: boolean
    nom?: boolean
    email?: boolean
    mot_de_passe?: boolean
    role?: boolean
    photo_profil?: boolean
    biographie?: boolean
    date_inscription?: boolean
    telephone?: boolean
    adresse?: boolean
    note_moyenne?: boolean
  }, ExtArgs["result"]["utilisateur"]>

  export type utilisateurSelectScalar = {
    id_utilisateur?: boolean
    prenom?: boolean
    nom?: boolean
    email?: boolean
    mot_de_passe?: boolean
    role?: boolean
    photo_profil?: boolean
    biographie?: boolean
    date_inscription?: boolean
    telephone?: boolean
    adresse?: boolean
    note_moyenne?: boolean
  }

  export type utilisateurOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id_utilisateur" | "prenom" | "nom" | "email" | "mot_de_passe" | "role" | "photo_profil" | "biographie" | "date_inscription" | "telephone" | "adresse" | "note_moyenne", ExtArgs["result"]["utilisateur"]>
  export type utilisateurInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    avis?: boolean | utilisateur$avisArgs<ExtArgs>
    heurescumul_es?: boolean | utilisateur$heurescumul_esArgs<ExtArgs>
    jardin?: boolean | utilisateur$jardinArgs<ExtArgs>
    messagerie_messagerie_id_destinataireToutilisateur?: boolean | utilisateur$messagerie_messagerie_id_destinataireToutilisateurArgs<ExtArgs>
    messagerie_messagerie_id_envoyeurToutilisateur?: boolean | utilisateur$messagerie_messagerie_id_envoyeurToutilisateurArgs<ExtArgs>
    reservation?: boolean | utilisateur$reservationArgs<ExtArgs>
    competences?: boolean | utilisateur$competencesArgs<ExtArgs>
    _count?: boolean | UtilisateurCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type utilisateurIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type utilisateurIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $utilisateurPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "utilisateur"
    objects: {
      avis: Prisma.$avisPayload<ExtArgs>[]
      heurescumul_es: Prisma.$heurescumul_esPayload<ExtArgs>[]
      jardin: Prisma.$jardinPayload<ExtArgs> | null
      messagerie_messagerie_id_destinataireToutilisateur: Prisma.$messageriePayload<ExtArgs>[]
      messagerie_messagerie_id_envoyeurToutilisateur: Prisma.$messageriePayload<ExtArgs>[]
      reservation: Prisma.$reservationPayload<ExtArgs>[]
      competences: Prisma.$utilisateurCompetencePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id_utilisateur: bigint
      prenom: string | null
      nom: string | null
      email: string | null
      mot_de_passe: string | null
      role: string | null
      photo_profil: string | null
      biographie: string | null
      date_inscription: Date | null
      telephone: string | null
      adresse: string | null
      note_moyenne: number | null
    }, ExtArgs["result"]["utilisateur"]>
    composites: {}
  }

  type utilisateurGetPayload<S extends boolean | null | undefined | utilisateurDefaultArgs> = $Result.GetResult<Prisma.$utilisateurPayload, S>

  type utilisateurCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<utilisateurFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UtilisateurCountAggregateInputType | true
    }

  export interface utilisateurDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['utilisateur'], meta: { name: 'utilisateur' } }
    /**
     * Find zero or one Utilisateur that matches the filter.
     * @param {utilisateurFindUniqueArgs} args - Arguments to find a Utilisateur
     * @example
     * // Get one Utilisateur
     * const utilisateur = await prisma.utilisateur.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends utilisateurFindUniqueArgs>(args: SelectSubset<T, utilisateurFindUniqueArgs<ExtArgs>>): Prisma__utilisateurClient<$Result.GetResult<Prisma.$utilisateurPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Utilisateur that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {utilisateurFindUniqueOrThrowArgs} args - Arguments to find a Utilisateur
     * @example
     * // Get one Utilisateur
     * const utilisateur = await prisma.utilisateur.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends utilisateurFindUniqueOrThrowArgs>(args: SelectSubset<T, utilisateurFindUniqueOrThrowArgs<ExtArgs>>): Prisma__utilisateurClient<$Result.GetResult<Prisma.$utilisateurPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Utilisateur that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {utilisateurFindFirstArgs} args - Arguments to find a Utilisateur
     * @example
     * // Get one Utilisateur
     * const utilisateur = await prisma.utilisateur.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends utilisateurFindFirstArgs>(args?: SelectSubset<T, utilisateurFindFirstArgs<ExtArgs>>): Prisma__utilisateurClient<$Result.GetResult<Prisma.$utilisateurPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Utilisateur that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {utilisateurFindFirstOrThrowArgs} args - Arguments to find a Utilisateur
     * @example
     * // Get one Utilisateur
     * const utilisateur = await prisma.utilisateur.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends utilisateurFindFirstOrThrowArgs>(args?: SelectSubset<T, utilisateurFindFirstOrThrowArgs<ExtArgs>>): Prisma__utilisateurClient<$Result.GetResult<Prisma.$utilisateurPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Utilisateurs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {utilisateurFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Utilisateurs
     * const utilisateurs = await prisma.utilisateur.findMany()
     * 
     * // Get first 10 Utilisateurs
     * const utilisateurs = await prisma.utilisateur.findMany({ take: 10 })
     * 
     * // Only select the `id_utilisateur`
     * const utilisateurWithId_utilisateurOnly = await prisma.utilisateur.findMany({ select: { id_utilisateur: true } })
     * 
     */
    findMany<T extends utilisateurFindManyArgs>(args?: SelectSubset<T, utilisateurFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$utilisateurPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Utilisateur.
     * @param {utilisateurCreateArgs} args - Arguments to create a Utilisateur.
     * @example
     * // Create one Utilisateur
     * const Utilisateur = await prisma.utilisateur.create({
     *   data: {
     *     // ... data to create a Utilisateur
     *   }
     * })
     * 
     */
    create<T extends utilisateurCreateArgs>(args: SelectSubset<T, utilisateurCreateArgs<ExtArgs>>): Prisma__utilisateurClient<$Result.GetResult<Prisma.$utilisateurPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Utilisateurs.
     * @param {utilisateurCreateManyArgs} args - Arguments to create many Utilisateurs.
     * @example
     * // Create many Utilisateurs
     * const utilisateur = await prisma.utilisateur.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends utilisateurCreateManyArgs>(args?: SelectSubset<T, utilisateurCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Utilisateurs and returns the data saved in the database.
     * @param {utilisateurCreateManyAndReturnArgs} args - Arguments to create many Utilisateurs.
     * @example
     * // Create many Utilisateurs
     * const utilisateur = await prisma.utilisateur.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Utilisateurs and only return the `id_utilisateur`
     * const utilisateurWithId_utilisateurOnly = await prisma.utilisateur.createManyAndReturn({
     *   select: { id_utilisateur: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends utilisateurCreateManyAndReturnArgs>(args?: SelectSubset<T, utilisateurCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$utilisateurPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Utilisateur.
     * @param {utilisateurDeleteArgs} args - Arguments to delete one Utilisateur.
     * @example
     * // Delete one Utilisateur
     * const Utilisateur = await prisma.utilisateur.delete({
     *   where: {
     *     // ... filter to delete one Utilisateur
     *   }
     * })
     * 
     */
    delete<T extends utilisateurDeleteArgs>(args: SelectSubset<T, utilisateurDeleteArgs<ExtArgs>>): Prisma__utilisateurClient<$Result.GetResult<Prisma.$utilisateurPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Utilisateur.
     * @param {utilisateurUpdateArgs} args - Arguments to update one Utilisateur.
     * @example
     * // Update one Utilisateur
     * const utilisateur = await prisma.utilisateur.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends utilisateurUpdateArgs>(args: SelectSubset<T, utilisateurUpdateArgs<ExtArgs>>): Prisma__utilisateurClient<$Result.GetResult<Prisma.$utilisateurPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Utilisateurs.
     * @param {utilisateurDeleteManyArgs} args - Arguments to filter Utilisateurs to delete.
     * @example
     * // Delete a few Utilisateurs
     * const { count } = await prisma.utilisateur.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends utilisateurDeleteManyArgs>(args?: SelectSubset<T, utilisateurDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Utilisateurs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {utilisateurUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Utilisateurs
     * const utilisateur = await prisma.utilisateur.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends utilisateurUpdateManyArgs>(args: SelectSubset<T, utilisateurUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Utilisateurs and returns the data updated in the database.
     * @param {utilisateurUpdateManyAndReturnArgs} args - Arguments to update many Utilisateurs.
     * @example
     * // Update many Utilisateurs
     * const utilisateur = await prisma.utilisateur.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Utilisateurs and only return the `id_utilisateur`
     * const utilisateurWithId_utilisateurOnly = await prisma.utilisateur.updateManyAndReturn({
     *   select: { id_utilisateur: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends utilisateurUpdateManyAndReturnArgs>(args: SelectSubset<T, utilisateurUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$utilisateurPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Utilisateur.
     * @param {utilisateurUpsertArgs} args - Arguments to update or create a Utilisateur.
     * @example
     * // Update or create a Utilisateur
     * const utilisateur = await prisma.utilisateur.upsert({
     *   create: {
     *     // ... data to create a Utilisateur
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Utilisateur we want to update
     *   }
     * })
     */
    upsert<T extends utilisateurUpsertArgs>(args: SelectSubset<T, utilisateurUpsertArgs<ExtArgs>>): Prisma__utilisateurClient<$Result.GetResult<Prisma.$utilisateurPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Utilisateurs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {utilisateurCountArgs} args - Arguments to filter Utilisateurs to count.
     * @example
     * // Count the number of Utilisateurs
     * const count = await prisma.utilisateur.count({
     *   where: {
     *     // ... the filter for the Utilisateurs we want to count
     *   }
     * })
    **/
    count<T extends utilisateurCountArgs>(
      args?: Subset<T, utilisateurCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UtilisateurCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Utilisateur.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UtilisateurAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UtilisateurAggregateArgs>(args: Subset<T, UtilisateurAggregateArgs>): Prisma.PrismaPromise<GetUtilisateurAggregateType<T>>

    /**
     * Group by Utilisateur.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {utilisateurGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends utilisateurGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: utilisateurGroupByArgs['orderBy'] }
        : { orderBy?: utilisateurGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, utilisateurGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUtilisateurGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the utilisateur model
   */
  readonly fields: utilisateurFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for utilisateur.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__utilisateurClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    avis<T extends utilisateur$avisArgs<ExtArgs> = {}>(args?: Subset<T, utilisateur$avisArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$avisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    heurescumul_es<T extends utilisateur$heurescumul_esArgs<ExtArgs> = {}>(args?: Subset<T, utilisateur$heurescumul_esArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$heurescumul_esPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    jardin<T extends utilisateur$jardinArgs<ExtArgs> = {}>(args?: Subset<T, utilisateur$jardinArgs<ExtArgs>>): Prisma__jardinClient<$Result.GetResult<Prisma.$jardinPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    messagerie_messagerie_id_destinataireToutilisateur<T extends utilisateur$messagerie_messagerie_id_destinataireToutilisateurArgs<ExtArgs> = {}>(args?: Subset<T, utilisateur$messagerie_messagerie_id_destinataireToutilisateurArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$messageriePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messagerie_messagerie_id_envoyeurToutilisateur<T extends utilisateur$messagerie_messagerie_id_envoyeurToutilisateurArgs<ExtArgs> = {}>(args?: Subset<T, utilisateur$messagerie_messagerie_id_envoyeurToutilisateurArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$messageriePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reservation<T extends utilisateur$reservationArgs<ExtArgs> = {}>(args?: Subset<T, utilisateur$reservationArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reservationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    competences<T extends utilisateur$competencesArgs<ExtArgs> = {}>(args?: Subset<T, utilisateur$competencesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$utilisateurCompetencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the utilisateur model
   */
  interface utilisateurFieldRefs {
    readonly id_utilisateur: FieldRef<"utilisateur", 'BigInt'>
    readonly prenom: FieldRef<"utilisateur", 'String'>
    readonly nom: FieldRef<"utilisateur", 'String'>
    readonly email: FieldRef<"utilisateur", 'String'>
    readonly mot_de_passe: FieldRef<"utilisateur", 'String'>
    readonly role: FieldRef<"utilisateur", 'String'>
    readonly photo_profil: FieldRef<"utilisateur", 'String'>
    readonly biographie: FieldRef<"utilisateur", 'String'>
    readonly date_inscription: FieldRef<"utilisateur", 'DateTime'>
    readonly telephone: FieldRef<"utilisateur", 'String'>
    readonly adresse: FieldRef<"utilisateur", 'String'>
    readonly note_moyenne: FieldRef<"utilisateur", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * utilisateur findUnique
   */
  export type utilisateurFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateur
     */
    select?: utilisateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateur
     */
    omit?: utilisateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurInclude<ExtArgs> | null
    /**
     * Filter, which utilisateur to fetch.
     */
    where: utilisateurWhereUniqueInput
  }

  /**
   * utilisateur findUniqueOrThrow
   */
  export type utilisateurFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateur
     */
    select?: utilisateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateur
     */
    omit?: utilisateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurInclude<ExtArgs> | null
    /**
     * Filter, which utilisateur to fetch.
     */
    where: utilisateurWhereUniqueInput
  }

  /**
   * utilisateur findFirst
   */
  export type utilisateurFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateur
     */
    select?: utilisateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateur
     */
    omit?: utilisateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurInclude<ExtArgs> | null
    /**
     * Filter, which utilisateur to fetch.
     */
    where?: utilisateurWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of utilisateurs to fetch.
     */
    orderBy?: utilisateurOrderByWithRelationInput | utilisateurOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for utilisateurs.
     */
    cursor?: utilisateurWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` utilisateurs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` utilisateurs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of utilisateurs.
     */
    distinct?: UtilisateurScalarFieldEnum | UtilisateurScalarFieldEnum[]
  }

  /**
   * utilisateur findFirstOrThrow
   */
  export type utilisateurFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateur
     */
    select?: utilisateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateur
     */
    omit?: utilisateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurInclude<ExtArgs> | null
    /**
     * Filter, which utilisateur to fetch.
     */
    where?: utilisateurWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of utilisateurs to fetch.
     */
    orderBy?: utilisateurOrderByWithRelationInput | utilisateurOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for utilisateurs.
     */
    cursor?: utilisateurWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` utilisateurs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` utilisateurs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of utilisateurs.
     */
    distinct?: UtilisateurScalarFieldEnum | UtilisateurScalarFieldEnum[]
  }

  /**
   * utilisateur findMany
   */
  export type utilisateurFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateur
     */
    select?: utilisateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateur
     */
    omit?: utilisateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurInclude<ExtArgs> | null
    /**
     * Filter, which utilisateurs to fetch.
     */
    where?: utilisateurWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of utilisateurs to fetch.
     */
    orderBy?: utilisateurOrderByWithRelationInput | utilisateurOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing utilisateurs.
     */
    cursor?: utilisateurWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` utilisateurs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` utilisateurs.
     */
    skip?: number
    distinct?: UtilisateurScalarFieldEnum | UtilisateurScalarFieldEnum[]
  }

  /**
   * utilisateur create
   */
  export type utilisateurCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateur
     */
    select?: utilisateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateur
     */
    omit?: utilisateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurInclude<ExtArgs> | null
    /**
     * The data needed to create a utilisateur.
     */
    data?: XOR<utilisateurCreateInput, utilisateurUncheckedCreateInput>
  }

  /**
   * utilisateur createMany
   */
  export type utilisateurCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many utilisateurs.
     */
    data: utilisateurCreateManyInput | utilisateurCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * utilisateur createManyAndReturn
   */
  export type utilisateurCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateur
     */
    select?: utilisateurSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateur
     */
    omit?: utilisateurOmit<ExtArgs> | null
    /**
     * The data used to create many utilisateurs.
     */
    data: utilisateurCreateManyInput | utilisateurCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * utilisateur update
   */
  export type utilisateurUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateur
     */
    select?: utilisateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateur
     */
    omit?: utilisateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurInclude<ExtArgs> | null
    /**
     * The data needed to update a utilisateur.
     */
    data: XOR<utilisateurUpdateInput, utilisateurUncheckedUpdateInput>
    /**
     * Choose, which utilisateur to update.
     */
    where: utilisateurWhereUniqueInput
  }

  /**
   * utilisateur updateMany
   */
  export type utilisateurUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update utilisateurs.
     */
    data: XOR<utilisateurUpdateManyMutationInput, utilisateurUncheckedUpdateManyInput>
    /**
     * Filter which utilisateurs to update
     */
    where?: utilisateurWhereInput
    /**
     * Limit how many utilisateurs to update.
     */
    limit?: number
  }

  /**
   * utilisateur updateManyAndReturn
   */
  export type utilisateurUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateur
     */
    select?: utilisateurSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateur
     */
    omit?: utilisateurOmit<ExtArgs> | null
    /**
     * The data used to update utilisateurs.
     */
    data: XOR<utilisateurUpdateManyMutationInput, utilisateurUncheckedUpdateManyInput>
    /**
     * Filter which utilisateurs to update
     */
    where?: utilisateurWhereInput
    /**
     * Limit how many utilisateurs to update.
     */
    limit?: number
  }

  /**
   * utilisateur upsert
   */
  export type utilisateurUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateur
     */
    select?: utilisateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateur
     */
    omit?: utilisateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurInclude<ExtArgs> | null
    /**
     * The filter to search for the utilisateur to update in case it exists.
     */
    where: utilisateurWhereUniqueInput
    /**
     * In case the utilisateur found by the `where` argument doesn't exist, create a new utilisateur with this data.
     */
    create: XOR<utilisateurCreateInput, utilisateurUncheckedCreateInput>
    /**
     * In case the utilisateur was found with the provided `where` argument, update it with this data.
     */
    update: XOR<utilisateurUpdateInput, utilisateurUncheckedUpdateInput>
  }

  /**
   * utilisateur delete
   */
  export type utilisateurDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateur
     */
    select?: utilisateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateur
     */
    omit?: utilisateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurInclude<ExtArgs> | null
    /**
     * Filter which utilisateur to delete.
     */
    where: utilisateurWhereUniqueInput
  }

  /**
   * utilisateur deleteMany
   */
  export type utilisateurDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which utilisateurs to delete
     */
    where?: utilisateurWhereInput
    /**
     * Limit how many utilisateurs to delete.
     */
    limit?: number
  }

  /**
   * utilisateur.avis
   */
  export type utilisateur$avisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the avis
     */
    select?: avisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the avis
     */
    omit?: avisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: avisInclude<ExtArgs> | null
    where?: avisWhereInput
    orderBy?: avisOrderByWithRelationInput | avisOrderByWithRelationInput[]
    cursor?: avisWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AvisScalarFieldEnum | AvisScalarFieldEnum[]
  }

  /**
   * utilisateur.heurescumul_es
   */
  export type utilisateur$heurescumul_esArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the heurescumul_es
     */
    select?: heurescumul_esSelect<ExtArgs> | null
    /**
     * Omit specific fields from the heurescumul_es
     */
    omit?: heurescumul_esOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: heurescumul_esInclude<ExtArgs> | null
    where?: heurescumul_esWhereInput
    orderBy?: heurescumul_esOrderByWithRelationInput | heurescumul_esOrderByWithRelationInput[]
    cursor?: heurescumul_esWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Heurescumul_esScalarFieldEnum | Heurescumul_esScalarFieldEnum[]
  }

  /**
   * utilisateur.jardin
   */
  export type utilisateur$jardinArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the jardin
     */
    select?: jardinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the jardin
     */
    omit?: jardinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: jardinInclude<ExtArgs> | null
    where?: jardinWhereInput
  }

  /**
   * utilisateur.messagerie_messagerie_id_destinataireToutilisateur
   */
  export type utilisateur$messagerie_messagerie_id_destinataireToutilisateurArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messagerie
     */
    select?: messagerieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messagerie
     */
    omit?: messagerieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagerieInclude<ExtArgs> | null
    where?: messagerieWhereInput
    orderBy?: messagerieOrderByWithRelationInput | messagerieOrderByWithRelationInput[]
    cursor?: messagerieWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessagerieScalarFieldEnum | MessagerieScalarFieldEnum[]
  }

  /**
   * utilisateur.messagerie_messagerie_id_envoyeurToutilisateur
   */
  export type utilisateur$messagerie_messagerie_id_envoyeurToutilisateurArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messagerie
     */
    select?: messagerieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messagerie
     */
    omit?: messagerieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagerieInclude<ExtArgs> | null
    where?: messagerieWhereInput
    orderBy?: messagerieOrderByWithRelationInput | messagerieOrderByWithRelationInput[]
    cursor?: messagerieWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessagerieScalarFieldEnum | MessagerieScalarFieldEnum[]
  }

  /**
   * utilisateur.reservation
   */
  export type utilisateur$reservationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reservation
     */
    select?: reservationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reservation
     */
    omit?: reservationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reservationInclude<ExtArgs> | null
    where?: reservationWhereInput
    orderBy?: reservationOrderByWithRelationInput | reservationOrderByWithRelationInput[]
    cursor?: reservationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReservationScalarFieldEnum | ReservationScalarFieldEnum[]
  }

  /**
   * utilisateur.competences
   */
  export type utilisateur$competencesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateurCompetence
     */
    select?: utilisateurCompetenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateurCompetence
     */
    omit?: utilisateurCompetenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurCompetenceInclude<ExtArgs> | null
    where?: utilisateurCompetenceWhereInput
    orderBy?: utilisateurCompetenceOrderByWithRelationInput | utilisateurCompetenceOrderByWithRelationInput[]
    cursor?: utilisateurCompetenceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UtilisateurCompetenceScalarFieldEnum | UtilisateurCompetenceScalarFieldEnum[]
  }

  /**
   * utilisateur without action
   */
  export type utilisateurDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateur
     */
    select?: utilisateurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateur
     */
    omit?: utilisateurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurInclude<ExtArgs> | null
  }


  /**
   * Model competence
   */

  export type AggregateCompetence = {
    _count: CompetenceCountAggregateOutputType | null
    _avg: CompetenceAvgAggregateOutputType | null
    _sum: CompetenceSumAggregateOutputType | null
    _min: CompetenceMinAggregateOutputType | null
    _max: CompetenceMaxAggregateOutputType | null
  }

  export type CompetenceAvgAggregateOutputType = {
    id_competence: number | null
  }

  export type CompetenceSumAggregateOutputType = {
    id_competence: number | null
  }

  export type CompetenceMinAggregateOutputType = {
    id_competence: number | null
    nom: string | null
  }

  export type CompetenceMaxAggregateOutputType = {
    id_competence: number | null
    nom: string | null
  }

  export type CompetenceCountAggregateOutputType = {
    id_competence: number
    nom: number
    _all: number
  }


  export type CompetenceAvgAggregateInputType = {
    id_competence?: true
  }

  export type CompetenceSumAggregateInputType = {
    id_competence?: true
  }

  export type CompetenceMinAggregateInputType = {
    id_competence?: true
    nom?: true
  }

  export type CompetenceMaxAggregateInputType = {
    id_competence?: true
    nom?: true
  }

  export type CompetenceCountAggregateInputType = {
    id_competence?: true
    nom?: true
    _all?: true
  }

  export type CompetenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which competence to aggregate.
     */
    where?: competenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of competences to fetch.
     */
    orderBy?: competenceOrderByWithRelationInput | competenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: competenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` competences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` competences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned competences
    **/
    _count?: true | CompetenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CompetenceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CompetenceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompetenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompetenceMaxAggregateInputType
  }

  export type GetCompetenceAggregateType<T extends CompetenceAggregateArgs> = {
        [P in keyof T & keyof AggregateCompetence]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompetence[P]>
      : GetScalarType<T[P], AggregateCompetence[P]>
  }




  export type competenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: competenceWhereInput
    orderBy?: competenceOrderByWithAggregationInput | competenceOrderByWithAggregationInput[]
    by: CompetenceScalarFieldEnum[] | CompetenceScalarFieldEnum
    having?: competenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompetenceCountAggregateInputType | true
    _avg?: CompetenceAvgAggregateInputType
    _sum?: CompetenceSumAggregateInputType
    _min?: CompetenceMinAggregateInputType
    _max?: CompetenceMaxAggregateInputType
  }

  export type CompetenceGroupByOutputType = {
    id_competence: number
    nom: string
    _count: CompetenceCountAggregateOutputType | null
    _avg: CompetenceAvgAggregateOutputType | null
    _sum: CompetenceSumAggregateOutputType | null
    _min: CompetenceMinAggregateOutputType | null
    _max: CompetenceMaxAggregateOutputType | null
  }

  type GetCompetenceGroupByPayload<T extends competenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompetenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompetenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompetenceGroupByOutputType[P]>
            : GetScalarType<T[P], CompetenceGroupByOutputType[P]>
        }
      >
    >


  export type competenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_competence?: boolean
    nom?: boolean
    utilisateurs?: boolean | competence$utilisateursArgs<ExtArgs>
    _count?: boolean | CompetenceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["competence"]>

  export type competenceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_competence?: boolean
    nom?: boolean
  }, ExtArgs["result"]["competence"]>

  export type competenceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_competence?: boolean
    nom?: boolean
  }, ExtArgs["result"]["competence"]>

  export type competenceSelectScalar = {
    id_competence?: boolean
    nom?: boolean
  }

  export type competenceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id_competence" | "nom", ExtArgs["result"]["competence"]>
  export type competenceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    utilisateurs?: boolean | competence$utilisateursArgs<ExtArgs>
    _count?: boolean | CompetenceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type competenceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type competenceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $competencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "competence"
    objects: {
      utilisateurs: Prisma.$utilisateurCompetencePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id_competence: number
      nom: string
    }, ExtArgs["result"]["competence"]>
    composites: {}
  }

  type competenceGetPayload<S extends boolean | null | undefined | competenceDefaultArgs> = $Result.GetResult<Prisma.$competencePayload, S>

  type competenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<competenceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CompetenceCountAggregateInputType | true
    }

  export interface competenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['competence'], meta: { name: 'competence' } }
    /**
     * Find zero or one Competence that matches the filter.
     * @param {competenceFindUniqueArgs} args - Arguments to find a Competence
     * @example
     * // Get one Competence
     * const competence = await prisma.competence.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends competenceFindUniqueArgs>(args: SelectSubset<T, competenceFindUniqueArgs<ExtArgs>>): Prisma__competenceClient<$Result.GetResult<Prisma.$competencePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Competence that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {competenceFindUniqueOrThrowArgs} args - Arguments to find a Competence
     * @example
     * // Get one Competence
     * const competence = await prisma.competence.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends competenceFindUniqueOrThrowArgs>(args: SelectSubset<T, competenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__competenceClient<$Result.GetResult<Prisma.$competencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Competence that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {competenceFindFirstArgs} args - Arguments to find a Competence
     * @example
     * // Get one Competence
     * const competence = await prisma.competence.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends competenceFindFirstArgs>(args?: SelectSubset<T, competenceFindFirstArgs<ExtArgs>>): Prisma__competenceClient<$Result.GetResult<Prisma.$competencePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Competence that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {competenceFindFirstOrThrowArgs} args - Arguments to find a Competence
     * @example
     * // Get one Competence
     * const competence = await prisma.competence.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends competenceFindFirstOrThrowArgs>(args?: SelectSubset<T, competenceFindFirstOrThrowArgs<ExtArgs>>): Prisma__competenceClient<$Result.GetResult<Prisma.$competencePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Competences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {competenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Competences
     * const competences = await prisma.competence.findMany()
     * 
     * // Get first 10 Competences
     * const competences = await prisma.competence.findMany({ take: 10 })
     * 
     * // Only select the `id_competence`
     * const competenceWithId_competenceOnly = await prisma.competence.findMany({ select: { id_competence: true } })
     * 
     */
    findMany<T extends competenceFindManyArgs>(args?: SelectSubset<T, competenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$competencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Competence.
     * @param {competenceCreateArgs} args - Arguments to create a Competence.
     * @example
     * // Create one Competence
     * const Competence = await prisma.competence.create({
     *   data: {
     *     // ... data to create a Competence
     *   }
     * })
     * 
     */
    create<T extends competenceCreateArgs>(args: SelectSubset<T, competenceCreateArgs<ExtArgs>>): Prisma__competenceClient<$Result.GetResult<Prisma.$competencePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Competences.
     * @param {competenceCreateManyArgs} args - Arguments to create many Competences.
     * @example
     * // Create many Competences
     * const competence = await prisma.competence.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends competenceCreateManyArgs>(args?: SelectSubset<T, competenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Competences and returns the data saved in the database.
     * @param {competenceCreateManyAndReturnArgs} args - Arguments to create many Competences.
     * @example
     * // Create many Competences
     * const competence = await prisma.competence.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Competences and only return the `id_competence`
     * const competenceWithId_competenceOnly = await prisma.competence.createManyAndReturn({
     *   select: { id_competence: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends competenceCreateManyAndReturnArgs>(args?: SelectSubset<T, competenceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$competencePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Competence.
     * @param {competenceDeleteArgs} args - Arguments to delete one Competence.
     * @example
     * // Delete one Competence
     * const Competence = await prisma.competence.delete({
     *   where: {
     *     // ... filter to delete one Competence
     *   }
     * })
     * 
     */
    delete<T extends competenceDeleteArgs>(args: SelectSubset<T, competenceDeleteArgs<ExtArgs>>): Prisma__competenceClient<$Result.GetResult<Prisma.$competencePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Competence.
     * @param {competenceUpdateArgs} args - Arguments to update one Competence.
     * @example
     * // Update one Competence
     * const competence = await prisma.competence.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends competenceUpdateArgs>(args: SelectSubset<T, competenceUpdateArgs<ExtArgs>>): Prisma__competenceClient<$Result.GetResult<Prisma.$competencePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Competences.
     * @param {competenceDeleteManyArgs} args - Arguments to filter Competences to delete.
     * @example
     * // Delete a few Competences
     * const { count } = await prisma.competence.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends competenceDeleteManyArgs>(args?: SelectSubset<T, competenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Competences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {competenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Competences
     * const competence = await prisma.competence.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends competenceUpdateManyArgs>(args: SelectSubset<T, competenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Competences and returns the data updated in the database.
     * @param {competenceUpdateManyAndReturnArgs} args - Arguments to update many Competences.
     * @example
     * // Update many Competences
     * const competence = await prisma.competence.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Competences and only return the `id_competence`
     * const competenceWithId_competenceOnly = await prisma.competence.updateManyAndReturn({
     *   select: { id_competence: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends competenceUpdateManyAndReturnArgs>(args: SelectSubset<T, competenceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$competencePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Competence.
     * @param {competenceUpsertArgs} args - Arguments to update or create a Competence.
     * @example
     * // Update or create a Competence
     * const competence = await prisma.competence.upsert({
     *   create: {
     *     // ... data to create a Competence
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Competence we want to update
     *   }
     * })
     */
    upsert<T extends competenceUpsertArgs>(args: SelectSubset<T, competenceUpsertArgs<ExtArgs>>): Prisma__competenceClient<$Result.GetResult<Prisma.$competencePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Competences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {competenceCountArgs} args - Arguments to filter Competences to count.
     * @example
     * // Count the number of Competences
     * const count = await prisma.competence.count({
     *   where: {
     *     // ... the filter for the Competences we want to count
     *   }
     * })
    **/
    count<T extends competenceCountArgs>(
      args?: Subset<T, competenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompetenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Competence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompetenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CompetenceAggregateArgs>(args: Subset<T, CompetenceAggregateArgs>): Prisma.PrismaPromise<GetCompetenceAggregateType<T>>

    /**
     * Group by Competence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {competenceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends competenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: competenceGroupByArgs['orderBy'] }
        : { orderBy?: competenceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, competenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompetenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the competence model
   */
  readonly fields: competenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for competence.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__competenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    utilisateurs<T extends competence$utilisateursArgs<ExtArgs> = {}>(args?: Subset<T, competence$utilisateursArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$utilisateurCompetencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the competence model
   */
  interface competenceFieldRefs {
    readonly id_competence: FieldRef<"competence", 'Int'>
    readonly nom: FieldRef<"competence", 'String'>
  }
    

  // Custom InputTypes
  /**
   * competence findUnique
   */
  export type competenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competence
     */
    select?: competenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the competence
     */
    omit?: competenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: competenceInclude<ExtArgs> | null
    /**
     * Filter, which competence to fetch.
     */
    where: competenceWhereUniqueInput
  }

  /**
   * competence findUniqueOrThrow
   */
  export type competenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competence
     */
    select?: competenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the competence
     */
    omit?: competenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: competenceInclude<ExtArgs> | null
    /**
     * Filter, which competence to fetch.
     */
    where: competenceWhereUniqueInput
  }

  /**
   * competence findFirst
   */
  export type competenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competence
     */
    select?: competenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the competence
     */
    omit?: competenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: competenceInclude<ExtArgs> | null
    /**
     * Filter, which competence to fetch.
     */
    where?: competenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of competences to fetch.
     */
    orderBy?: competenceOrderByWithRelationInput | competenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for competences.
     */
    cursor?: competenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` competences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` competences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of competences.
     */
    distinct?: CompetenceScalarFieldEnum | CompetenceScalarFieldEnum[]
  }

  /**
   * competence findFirstOrThrow
   */
  export type competenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competence
     */
    select?: competenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the competence
     */
    omit?: competenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: competenceInclude<ExtArgs> | null
    /**
     * Filter, which competence to fetch.
     */
    where?: competenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of competences to fetch.
     */
    orderBy?: competenceOrderByWithRelationInput | competenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for competences.
     */
    cursor?: competenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` competences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` competences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of competences.
     */
    distinct?: CompetenceScalarFieldEnum | CompetenceScalarFieldEnum[]
  }

  /**
   * competence findMany
   */
  export type competenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competence
     */
    select?: competenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the competence
     */
    omit?: competenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: competenceInclude<ExtArgs> | null
    /**
     * Filter, which competences to fetch.
     */
    where?: competenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of competences to fetch.
     */
    orderBy?: competenceOrderByWithRelationInput | competenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing competences.
     */
    cursor?: competenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` competences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` competences.
     */
    skip?: number
    distinct?: CompetenceScalarFieldEnum | CompetenceScalarFieldEnum[]
  }

  /**
   * competence create
   */
  export type competenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competence
     */
    select?: competenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the competence
     */
    omit?: competenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: competenceInclude<ExtArgs> | null
    /**
     * The data needed to create a competence.
     */
    data: XOR<competenceCreateInput, competenceUncheckedCreateInput>
  }

  /**
   * competence createMany
   */
  export type competenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many competences.
     */
    data: competenceCreateManyInput | competenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * competence createManyAndReturn
   */
  export type competenceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competence
     */
    select?: competenceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the competence
     */
    omit?: competenceOmit<ExtArgs> | null
    /**
     * The data used to create many competences.
     */
    data: competenceCreateManyInput | competenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * competence update
   */
  export type competenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competence
     */
    select?: competenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the competence
     */
    omit?: competenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: competenceInclude<ExtArgs> | null
    /**
     * The data needed to update a competence.
     */
    data: XOR<competenceUpdateInput, competenceUncheckedUpdateInput>
    /**
     * Choose, which competence to update.
     */
    where: competenceWhereUniqueInput
  }

  /**
   * competence updateMany
   */
  export type competenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update competences.
     */
    data: XOR<competenceUpdateManyMutationInput, competenceUncheckedUpdateManyInput>
    /**
     * Filter which competences to update
     */
    where?: competenceWhereInput
    /**
     * Limit how many competences to update.
     */
    limit?: number
  }

  /**
   * competence updateManyAndReturn
   */
  export type competenceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competence
     */
    select?: competenceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the competence
     */
    omit?: competenceOmit<ExtArgs> | null
    /**
     * The data used to update competences.
     */
    data: XOR<competenceUpdateManyMutationInput, competenceUncheckedUpdateManyInput>
    /**
     * Filter which competences to update
     */
    where?: competenceWhereInput
    /**
     * Limit how many competences to update.
     */
    limit?: number
  }

  /**
   * competence upsert
   */
  export type competenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competence
     */
    select?: competenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the competence
     */
    omit?: competenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: competenceInclude<ExtArgs> | null
    /**
     * The filter to search for the competence to update in case it exists.
     */
    where: competenceWhereUniqueInput
    /**
     * In case the competence found by the `where` argument doesn't exist, create a new competence with this data.
     */
    create: XOR<competenceCreateInput, competenceUncheckedCreateInput>
    /**
     * In case the competence was found with the provided `where` argument, update it with this data.
     */
    update: XOR<competenceUpdateInput, competenceUncheckedUpdateInput>
  }

  /**
   * competence delete
   */
  export type competenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competence
     */
    select?: competenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the competence
     */
    omit?: competenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: competenceInclude<ExtArgs> | null
    /**
     * Filter which competence to delete.
     */
    where: competenceWhereUniqueInput
  }

  /**
   * competence deleteMany
   */
  export type competenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which competences to delete
     */
    where?: competenceWhereInput
    /**
     * Limit how many competences to delete.
     */
    limit?: number
  }

  /**
   * competence.utilisateurs
   */
  export type competence$utilisateursArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateurCompetence
     */
    select?: utilisateurCompetenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateurCompetence
     */
    omit?: utilisateurCompetenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurCompetenceInclude<ExtArgs> | null
    where?: utilisateurCompetenceWhereInput
    orderBy?: utilisateurCompetenceOrderByWithRelationInput | utilisateurCompetenceOrderByWithRelationInput[]
    cursor?: utilisateurCompetenceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UtilisateurCompetenceScalarFieldEnum | UtilisateurCompetenceScalarFieldEnum[]
  }

  /**
   * competence without action
   */
  export type competenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competence
     */
    select?: competenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the competence
     */
    omit?: competenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: competenceInclude<ExtArgs> | null
  }


  /**
   * Model utilisateurCompetence
   */

  export type AggregateUtilisateurCompetence = {
    _count: UtilisateurCompetenceCountAggregateOutputType | null
    _avg: UtilisateurCompetenceAvgAggregateOutputType | null
    _sum: UtilisateurCompetenceSumAggregateOutputType | null
    _min: UtilisateurCompetenceMinAggregateOutputType | null
    _max: UtilisateurCompetenceMaxAggregateOutputType | null
  }

  export type UtilisateurCompetenceAvgAggregateOutputType = {
    id_utilisateur_competence: number | null
    id_utilisateur: number | null
    id_competence: number | null
  }

  export type UtilisateurCompetenceSumAggregateOutputType = {
    id_utilisateur_competence: number | null
    id_utilisateur: bigint | null
    id_competence: number | null
  }

  export type UtilisateurCompetenceMinAggregateOutputType = {
    id_utilisateur_competence: number | null
    id_utilisateur: bigint | null
    id_competence: number | null
  }

  export type UtilisateurCompetenceMaxAggregateOutputType = {
    id_utilisateur_competence: number | null
    id_utilisateur: bigint | null
    id_competence: number | null
  }

  export type UtilisateurCompetenceCountAggregateOutputType = {
    id_utilisateur_competence: number
    id_utilisateur: number
    id_competence: number
    _all: number
  }


  export type UtilisateurCompetenceAvgAggregateInputType = {
    id_utilisateur_competence?: true
    id_utilisateur?: true
    id_competence?: true
  }

  export type UtilisateurCompetenceSumAggregateInputType = {
    id_utilisateur_competence?: true
    id_utilisateur?: true
    id_competence?: true
  }

  export type UtilisateurCompetenceMinAggregateInputType = {
    id_utilisateur_competence?: true
    id_utilisateur?: true
    id_competence?: true
  }

  export type UtilisateurCompetenceMaxAggregateInputType = {
    id_utilisateur_competence?: true
    id_utilisateur?: true
    id_competence?: true
  }

  export type UtilisateurCompetenceCountAggregateInputType = {
    id_utilisateur_competence?: true
    id_utilisateur?: true
    id_competence?: true
    _all?: true
  }

  export type UtilisateurCompetenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which utilisateurCompetence to aggregate.
     */
    where?: utilisateurCompetenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of utilisateurCompetences to fetch.
     */
    orderBy?: utilisateurCompetenceOrderByWithRelationInput | utilisateurCompetenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: utilisateurCompetenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` utilisateurCompetences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` utilisateurCompetences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned utilisateurCompetences
    **/
    _count?: true | UtilisateurCompetenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UtilisateurCompetenceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UtilisateurCompetenceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UtilisateurCompetenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UtilisateurCompetenceMaxAggregateInputType
  }

  export type GetUtilisateurCompetenceAggregateType<T extends UtilisateurCompetenceAggregateArgs> = {
        [P in keyof T & keyof AggregateUtilisateurCompetence]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUtilisateurCompetence[P]>
      : GetScalarType<T[P], AggregateUtilisateurCompetence[P]>
  }




  export type utilisateurCompetenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: utilisateurCompetenceWhereInput
    orderBy?: utilisateurCompetenceOrderByWithAggregationInput | utilisateurCompetenceOrderByWithAggregationInput[]
    by: UtilisateurCompetenceScalarFieldEnum[] | UtilisateurCompetenceScalarFieldEnum
    having?: utilisateurCompetenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UtilisateurCompetenceCountAggregateInputType | true
    _avg?: UtilisateurCompetenceAvgAggregateInputType
    _sum?: UtilisateurCompetenceSumAggregateInputType
    _min?: UtilisateurCompetenceMinAggregateInputType
    _max?: UtilisateurCompetenceMaxAggregateInputType
  }

  export type UtilisateurCompetenceGroupByOutputType = {
    id_utilisateur_competence: number
    id_utilisateur: bigint
    id_competence: number
    _count: UtilisateurCompetenceCountAggregateOutputType | null
    _avg: UtilisateurCompetenceAvgAggregateOutputType | null
    _sum: UtilisateurCompetenceSumAggregateOutputType | null
    _min: UtilisateurCompetenceMinAggregateOutputType | null
    _max: UtilisateurCompetenceMaxAggregateOutputType | null
  }

  type GetUtilisateurCompetenceGroupByPayload<T extends utilisateurCompetenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UtilisateurCompetenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UtilisateurCompetenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UtilisateurCompetenceGroupByOutputType[P]>
            : GetScalarType<T[P], UtilisateurCompetenceGroupByOutputType[P]>
        }
      >
    >


  export type utilisateurCompetenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_utilisateur_competence?: boolean
    id_utilisateur?: boolean
    id_competence?: boolean
    utilisateur?: boolean | utilisateurDefaultArgs<ExtArgs>
    competence?: boolean | competenceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["utilisateurCompetence"]>

  export type utilisateurCompetenceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_utilisateur_competence?: boolean
    id_utilisateur?: boolean
    id_competence?: boolean
    utilisateur?: boolean | utilisateurDefaultArgs<ExtArgs>
    competence?: boolean | competenceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["utilisateurCompetence"]>

  export type utilisateurCompetenceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_utilisateur_competence?: boolean
    id_utilisateur?: boolean
    id_competence?: boolean
    utilisateur?: boolean | utilisateurDefaultArgs<ExtArgs>
    competence?: boolean | competenceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["utilisateurCompetence"]>

  export type utilisateurCompetenceSelectScalar = {
    id_utilisateur_competence?: boolean
    id_utilisateur?: boolean
    id_competence?: boolean
  }

  export type utilisateurCompetenceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id_utilisateur_competence" | "id_utilisateur" | "id_competence", ExtArgs["result"]["utilisateurCompetence"]>
  export type utilisateurCompetenceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    utilisateur?: boolean | utilisateurDefaultArgs<ExtArgs>
    competence?: boolean | competenceDefaultArgs<ExtArgs>
  }
  export type utilisateurCompetenceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    utilisateur?: boolean | utilisateurDefaultArgs<ExtArgs>
    competence?: boolean | competenceDefaultArgs<ExtArgs>
  }
  export type utilisateurCompetenceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    utilisateur?: boolean | utilisateurDefaultArgs<ExtArgs>
    competence?: boolean | competenceDefaultArgs<ExtArgs>
  }

  export type $utilisateurCompetencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "utilisateurCompetence"
    objects: {
      utilisateur: Prisma.$utilisateurPayload<ExtArgs>
      competence: Prisma.$competencePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id_utilisateur_competence: number
      id_utilisateur: bigint
      id_competence: number
    }, ExtArgs["result"]["utilisateurCompetence"]>
    composites: {}
  }

  type utilisateurCompetenceGetPayload<S extends boolean | null | undefined | utilisateurCompetenceDefaultArgs> = $Result.GetResult<Prisma.$utilisateurCompetencePayload, S>

  type utilisateurCompetenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<utilisateurCompetenceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UtilisateurCompetenceCountAggregateInputType | true
    }

  export interface utilisateurCompetenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['utilisateurCompetence'], meta: { name: 'utilisateurCompetence' } }
    /**
     * Find zero or one UtilisateurCompetence that matches the filter.
     * @param {utilisateurCompetenceFindUniqueArgs} args - Arguments to find a UtilisateurCompetence
     * @example
     * // Get one UtilisateurCompetence
     * const utilisateurCompetence = await prisma.utilisateurCompetence.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends utilisateurCompetenceFindUniqueArgs>(args: SelectSubset<T, utilisateurCompetenceFindUniqueArgs<ExtArgs>>): Prisma__utilisateurCompetenceClient<$Result.GetResult<Prisma.$utilisateurCompetencePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UtilisateurCompetence that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {utilisateurCompetenceFindUniqueOrThrowArgs} args - Arguments to find a UtilisateurCompetence
     * @example
     * // Get one UtilisateurCompetence
     * const utilisateurCompetence = await prisma.utilisateurCompetence.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends utilisateurCompetenceFindUniqueOrThrowArgs>(args: SelectSubset<T, utilisateurCompetenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__utilisateurCompetenceClient<$Result.GetResult<Prisma.$utilisateurCompetencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UtilisateurCompetence that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {utilisateurCompetenceFindFirstArgs} args - Arguments to find a UtilisateurCompetence
     * @example
     * // Get one UtilisateurCompetence
     * const utilisateurCompetence = await prisma.utilisateurCompetence.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends utilisateurCompetenceFindFirstArgs>(args?: SelectSubset<T, utilisateurCompetenceFindFirstArgs<ExtArgs>>): Prisma__utilisateurCompetenceClient<$Result.GetResult<Prisma.$utilisateurCompetencePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UtilisateurCompetence that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {utilisateurCompetenceFindFirstOrThrowArgs} args - Arguments to find a UtilisateurCompetence
     * @example
     * // Get one UtilisateurCompetence
     * const utilisateurCompetence = await prisma.utilisateurCompetence.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends utilisateurCompetenceFindFirstOrThrowArgs>(args?: SelectSubset<T, utilisateurCompetenceFindFirstOrThrowArgs<ExtArgs>>): Prisma__utilisateurCompetenceClient<$Result.GetResult<Prisma.$utilisateurCompetencePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UtilisateurCompetences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {utilisateurCompetenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UtilisateurCompetences
     * const utilisateurCompetences = await prisma.utilisateurCompetence.findMany()
     * 
     * // Get first 10 UtilisateurCompetences
     * const utilisateurCompetences = await prisma.utilisateurCompetence.findMany({ take: 10 })
     * 
     * // Only select the `id_utilisateur_competence`
     * const utilisateurCompetenceWithId_utilisateur_competenceOnly = await prisma.utilisateurCompetence.findMany({ select: { id_utilisateur_competence: true } })
     * 
     */
    findMany<T extends utilisateurCompetenceFindManyArgs>(args?: SelectSubset<T, utilisateurCompetenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$utilisateurCompetencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UtilisateurCompetence.
     * @param {utilisateurCompetenceCreateArgs} args - Arguments to create a UtilisateurCompetence.
     * @example
     * // Create one UtilisateurCompetence
     * const UtilisateurCompetence = await prisma.utilisateurCompetence.create({
     *   data: {
     *     // ... data to create a UtilisateurCompetence
     *   }
     * })
     * 
     */
    create<T extends utilisateurCompetenceCreateArgs>(args: SelectSubset<T, utilisateurCompetenceCreateArgs<ExtArgs>>): Prisma__utilisateurCompetenceClient<$Result.GetResult<Prisma.$utilisateurCompetencePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UtilisateurCompetences.
     * @param {utilisateurCompetenceCreateManyArgs} args - Arguments to create many UtilisateurCompetences.
     * @example
     * // Create many UtilisateurCompetences
     * const utilisateurCompetence = await prisma.utilisateurCompetence.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends utilisateurCompetenceCreateManyArgs>(args?: SelectSubset<T, utilisateurCompetenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UtilisateurCompetences and returns the data saved in the database.
     * @param {utilisateurCompetenceCreateManyAndReturnArgs} args - Arguments to create many UtilisateurCompetences.
     * @example
     * // Create many UtilisateurCompetences
     * const utilisateurCompetence = await prisma.utilisateurCompetence.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UtilisateurCompetences and only return the `id_utilisateur_competence`
     * const utilisateurCompetenceWithId_utilisateur_competenceOnly = await prisma.utilisateurCompetence.createManyAndReturn({
     *   select: { id_utilisateur_competence: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends utilisateurCompetenceCreateManyAndReturnArgs>(args?: SelectSubset<T, utilisateurCompetenceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$utilisateurCompetencePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UtilisateurCompetence.
     * @param {utilisateurCompetenceDeleteArgs} args - Arguments to delete one UtilisateurCompetence.
     * @example
     * // Delete one UtilisateurCompetence
     * const UtilisateurCompetence = await prisma.utilisateurCompetence.delete({
     *   where: {
     *     // ... filter to delete one UtilisateurCompetence
     *   }
     * })
     * 
     */
    delete<T extends utilisateurCompetenceDeleteArgs>(args: SelectSubset<T, utilisateurCompetenceDeleteArgs<ExtArgs>>): Prisma__utilisateurCompetenceClient<$Result.GetResult<Prisma.$utilisateurCompetencePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UtilisateurCompetence.
     * @param {utilisateurCompetenceUpdateArgs} args - Arguments to update one UtilisateurCompetence.
     * @example
     * // Update one UtilisateurCompetence
     * const utilisateurCompetence = await prisma.utilisateurCompetence.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends utilisateurCompetenceUpdateArgs>(args: SelectSubset<T, utilisateurCompetenceUpdateArgs<ExtArgs>>): Prisma__utilisateurCompetenceClient<$Result.GetResult<Prisma.$utilisateurCompetencePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UtilisateurCompetences.
     * @param {utilisateurCompetenceDeleteManyArgs} args - Arguments to filter UtilisateurCompetences to delete.
     * @example
     * // Delete a few UtilisateurCompetences
     * const { count } = await prisma.utilisateurCompetence.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends utilisateurCompetenceDeleteManyArgs>(args?: SelectSubset<T, utilisateurCompetenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UtilisateurCompetences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {utilisateurCompetenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UtilisateurCompetences
     * const utilisateurCompetence = await prisma.utilisateurCompetence.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends utilisateurCompetenceUpdateManyArgs>(args: SelectSubset<T, utilisateurCompetenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UtilisateurCompetences and returns the data updated in the database.
     * @param {utilisateurCompetenceUpdateManyAndReturnArgs} args - Arguments to update many UtilisateurCompetences.
     * @example
     * // Update many UtilisateurCompetences
     * const utilisateurCompetence = await prisma.utilisateurCompetence.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UtilisateurCompetences and only return the `id_utilisateur_competence`
     * const utilisateurCompetenceWithId_utilisateur_competenceOnly = await prisma.utilisateurCompetence.updateManyAndReturn({
     *   select: { id_utilisateur_competence: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends utilisateurCompetenceUpdateManyAndReturnArgs>(args: SelectSubset<T, utilisateurCompetenceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$utilisateurCompetencePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UtilisateurCompetence.
     * @param {utilisateurCompetenceUpsertArgs} args - Arguments to update or create a UtilisateurCompetence.
     * @example
     * // Update or create a UtilisateurCompetence
     * const utilisateurCompetence = await prisma.utilisateurCompetence.upsert({
     *   create: {
     *     // ... data to create a UtilisateurCompetence
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UtilisateurCompetence we want to update
     *   }
     * })
     */
    upsert<T extends utilisateurCompetenceUpsertArgs>(args: SelectSubset<T, utilisateurCompetenceUpsertArgs<ExtArgs>>): Prisma__utilisateurCompetenceClient<$Result.GetResult<Prisma.$utilisateurCompetencePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UtilisateurCompetences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {utilisateurCompetenceCountArgs} args - Arguments to filter UtilisateurCompetences to count.
     * @example
     * // Count the number of UtilisateurCompetences
     * const count = await prisma.utilisateurCompetence.count({
     *   where: {
     *     // ... the filter for the UtilisateurCompetences we want to count
     *   }
     * })
    **/
    count<T extends utilisateurCompetenceCountArgs>(
      args?: Subset<T, utilisateurCompetenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UtilisateurCompetenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UtilisateurCompetence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UtilisateurCompetenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UtilisateurCompetenceAggregateArgs>(args: Subset<T, UtilisateurCompetenceAggregateArgs>): Prisma.PrismaPromise<GetUtilisateurCompetenceAggregateType<T>>

    /**
     * Group by UtilisateurCompetence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {utilisateurCompetenceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends utilisateurCompetenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: utilisateurCompetenceGroupByArgs['orderBy'] }
        : { orderBy?: utilisateurCompetenceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, utilisateurCompetenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUtilisateurCompetenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the utilisateurCompetence model
   */
  readonly fields: utilisateurCompetenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for utilisateurCompetence.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__utilisateurCompetenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    utilisateur<T extends utilisateurDefaultArgs<ExtArgs> = {}>(args?: Subset<T, utilisateurDefaultArgs<ExtArgs>>): Prisma__utilisateurClient<$Result.GetResult<Prisma.$utilisateurPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    competence<T extends competenceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, competenceDefaultArgs<ExtArgs>>): Prisma__competenceClient<$Result.GetResult<Prisma.$competencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the utilisateurCompetence model
   */
  interface utilisateurCompetenceFieldRefs {
    readonly id_utilisateur_competence: FieldRef<"utilisateurCompetence", 'Int'>
    readonly id_utilisateur: FieldRef<"utilisateurCompetence", 'BigInt'>
    readonly id_competence: FieldRef<"utilisateurCompetence", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * utilisateurCompetence findUnique
   */
  export type utilisateurCompetenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateurCompetence
     */
    select?: utilisateurCompetenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateurCompetence
     */
    omit?: utilisateurCompetenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurCompetenceInclude<ExtArgs> | null
    /**
     * Filter, which utilisateurCompetence to fetch.
     */
    where: utilisateurCompetenceWhereUniqueInput
  }

  /**
   * utilisateurCompetence findUniqueOrThrow
   */
  export type utilisateurCompetenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateurCompetence
     */
    select?: utilisateurCompetenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateurCompetence
     */
    omit?: utilisateurCompetenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurCompetenceInclude<ExtArgs> | null
    /**
     * Filter, which utilisateurCompetence to fetch.
     */
    where: utilisateurCompetenceWhereUniqueInput
  }

  /**
   * utilisateurCompetence findFirst
   */
  export type utilisateurCompetenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateurCompetence
     */
    select?: utilisateurCompetenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateurCompetence
     */
    omit?: utilisateurCompetenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurCompetenceInclude<ExtArgs> | null
    /**
     * Filter, which utilisateurCompetence to fetch.
     */
    where?: utilisateurCompetenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of utilisateurCompetences to fetch.
     */
    orderBy?: utilisateurCompetenceOrderByWithRelationInput | utilisateurCompetenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for utilisateurCompetences.
     */
    cursor?: utilisateurCompetenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` utilisateurCompetences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` utilisateurCompetences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of utilisateurCompetences.
     */
    distinct?: UtilisateurCompetenceScalarFieldEnum | UtilisateurCompetenceScalarFieldEnum[]
  }

  /**
   * utilisateurCompetence findFirstOrThrow
   */
  export type utilisateurCompetenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateurCompetence
     */
    select?: utilisateurCompetenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateurCompetence
     */
    omit?: utilisateurCompetenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurCompetenceInclude<ExtArgs> | null
    /**
     * Filter, which utilisateurCompetence to fetch.
     */
    where?: utilisateurCompetenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of utilisateurCompetences to fetch.
     */
    orderBy?: utilisateurCompetenceOrderByWithRelationInput | utilisateurCompetenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for utilisateurCompetences.
     */
    cursor?: utilisateurCompetenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` utilisateurCompetences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` utilisateurCompetences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of utilisateurCompetences.
     */
    distinct?: UtilisateurCompetenceScalarFieldEnum | UtilisateurCompetenceScalarFieldEnum[]
  }

  /**
   * utilisateurCompetence findMany
   */
  export type utilisateurCompetenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateurCompetence
     */
    select?: utilisateurCompetenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateurCompetence
     */
    omit?: utilisateurCompetenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurCompetenceInclude<ExtArgs> | null
    /**
     * Filter, which utilisateurCompetences to fetch.
     */
    where?: utilisateurCompetenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of utilisateurCompetences to fetch.
     */
    orderBy?: utilisateurCompetenceOrderByWithRelationInput | utilisateurCompetenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing utilisateurCompetences.
     */
    cursor?: utilisateurCompetenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` utilisateurCompetences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` utilisateurCompetences.
     */
    skip?: number
    distinct?: UtilisateurCompetenceScalarFieldEnum | UtilisateurCompetenceScalarFieldEnum[]
  }

  /**
   * utilisateurCompetence create
   */
  export type utilisateurCompetenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateurCompetence
     */
    select?: utilisateurCompetenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateurCompetence
     */
    omit?: utilisateurCompetenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurCompetenceInclude<ExtArgs> | null
    /**
     * The data needed to create a utilisateurCompetence.
     */
    data: XOR<utilisateurCompetenceCreateInput, utilisateurCompetenceUncheckedCreateInput>
  }

  /**
   * utilisateurCompetence createMany
   */
  export type utilisateurCompetenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many utilisateurCompetences.
     */
    data: utilisateurCompetenceCreateManyInput | utilisateurCompetenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * utilisateurCompetence createManyAndReturn
   */
  export type utilisateurCompetenceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateurCompetence
     */
    select?: utilisateurCompetenceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateurCompetence
     */
    omit?: utilisateurCompetenceOmit<ExtArgs> | null
    /**
     * The data used to create many utilisateurCompetences.
     */
    data: utilisateurCompetenceCreateManyInput | utilisateurCompetenceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurCompetenceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * utilisateurCompetence update
   */
  export type utilisateurCompetenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateurCompetence
     */
    select?: utilisateurCompetenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateurCompetence
     */
    omit?: utilisateurCompetenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurCompetenceInclude<ExtArgs> | null
    /**
     * The data needed to update a utilisateurCompetence.
     */
    data: XOR<utilisateurCompetenceUpdateInput, utilisateurCompetenceUncheckedUpdateInput>
    /**
     * Choose, which utilisateurCompetence to update.
     */
    where: utilisateurCompetenceWhereUniqueInput
  }

  /**
   * utilisateurCompetence updateMany
   */
  export type utilisateurCompetenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update utilisateurCompetences.
     */
    data: XOR<utilisateurCompetenceUpdateManyMutationInput, utilisateurCompetenceUncheckedUpdateManyInput>
    /**
     * Filter which utilisateurCompetences to update
     */
    where?: utilisateurCompetenceWhereInput
    /**
     * Limit how many utilisateurCompetences to update.
     */
    limit?: number
  }

  /**
   * utilisateurCompetence updateManyAndReturn
   */
  export type utilisateurCompetenceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateurCompetence
     */
    select?: utilisateurCompetenceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateurCompetence
     */
    omit?: utilisateurCompetenceOmit<ExtArgs> | null
    /**
     * The data used to update utilisateurCompetences.
     */
    data: XOR<utilisateurCompetenceUpdateManyMutationInput, utilisateurCompetenceUncheckedUpdateManyInput>
    /**
     * Filter which utilisateurCompetences to update
     */
    where?: utilisateurCompetenceWhereInput
    /**
     * Limit how many utilisateurCompetences to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurCompetenceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * utilisateurCompetence upsert
   */
  export type utilisateurCompetenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateurCompetence
     */
    select?: utilisateurCompetenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateurCompetence
     */
    omit?: utilisateurCompetenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurCompetenceInclude<ExtArgs> | null
    /**
     * The filter to search for the utilisateurCompetence to update in case it exists.
     */
    where: utilisateurCompetenceWhereUniqueInput
    /**
     * In case the utilisateurCompetence found by the `where` argument doesn't exist, create a new utilisateurCompetence with this data.
     */
    create: XOR<utilisateurCompetenceCreateInput, utilisateurCompetenceUncheckedCreateInput>
    /**
     * In case the utilisateurCompetence was found with the provided `where` argument, update it with this data.
     */
    update: XOR<utilisateurCompetenceUpdateInput, utilisateurCompetenceUncheckedUpdateInput>
  }

  /**
   * utilisateurCompetence delete
   */
  export type utilisateurCompetenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateurCompetence
     */
    select?: utilisateurCompetenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateurCompetence
     */
    omit?: utilisateurCompetenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurCompetenceInclude<ExtArgs> | null
    /**
     * Filter which utilisateurCompetence to delete.
     */
    where: utilisateurCompetenceWhereUniqueInput
  }

  /**
   * utilisateurCompetence deleteMany
   */
  export type utilisateurCompetenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which utilisateurCompetences to delete
     */
    where?: utilisateurCompetenceWhereInput
    /**
     * Limit how many utilisateurCompetences to delete.
     */
    limit?: number
  }

  /**
   * utilisateurCompetence without action
   */
  export type utilisateurCompetenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the utilisateurCompetence
     */
    select?: utilisateurCompetenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the utilisateurCompetence
     */
    omit?: utilisateurCompetenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: utilisateurCompetenceInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AvisScalarFieldEnum: {
    id_avis: 'id_avis',
    id_utilisateur: 'id_utilisateur',
    id_jardin: 'id_jardin',
    note: 'note',
    commentaire: 'commentaire',
    date_avis: 'date_avis'
  };

  export type AvisScalarFieldEnum = (typeof AvisScalarFieldEnum)[keyof typeof AvisScalarFieldEnum]


  export const DisponibilitesScalarFieldEnum: {
    id_disponibilite: 'id_disponibilite',
    id_jardin: 'id_jardin',
    date_dispo: 'date_dispo',
    heure_debut: 'heure_debut',
    heure_fin: 'heure_fin',
    statut: 'statut'
  };

  export type DisponibilitesScalarFieldEnum = (typeof DisponibilitesScalarFieldEnum)[keyof typeof DisponibilitesScalarFieldEnum]


  export const Heurescumul_esScalarFieldEnum: {
    id_historique: 'id_historique',
    id_utilisateur: 'id_utilisateur',
    heures_travaillees: 'heures_travaillees',
    date_maj: 'date_maj'
  };

  export type Heurescumul_esScalarFieldEnum = (typeof Heurescumul_esScalarFieldEnum)[keyof typeof Heurescumul_esScalarFieldEnum]


  export const JardinScalarFieldEnum: {
    id_jardin: 'id_jardin',
    id_proprietaire: 'id_proprietaire',
    titre: 'titre',
    description: 'description',
    adresse: 'adresse',
    superficie: 'superficie',
    type: 'type',
    besoins: 'besoins',
    photos: 'photos',
    date_publication: 'date_publication',
    statut: 'statut',
    note_moyenne: 'note_moyenne'
  };

  export type JardinScalarFieldEnum = (typeof JardinScalarFieldEnum)[keyof typeof JardinScalarFieldEnum]


  export const MessagerieScalarFieldEnum: {
    id_message: 'id_message',
    id_envoyeur: 'id_envoyeur',
    id_destinataire: 'id_destinataire',
    contenu: 'contenu',
    date_envoi: 'date_envoi',
    lu: 'lu'
  };

  export type MessagerieScalarFieldEnum = (typeof MessagerieScalarFieldEnum)[keyof typeof MessagerieScalarFieldEnum]


  export const ReservationScalarFieldEnum: {
    id_reservation: 'id_reservation',
    id_utilisateur: 'id_utilisateur',
    id_jardin: 'id_jardin',
    id_disponibilite: 'id_disponibilite',
    statut: 'statut',
    date_reservation: 'date_reservation',
    commentaires: 'commentaires'
  };

  export type ReservationScalarFieldEnum = (typeof ReservationScalarFieldEnum)[keyof typeof ReservationScalarFieldEnum]


  export const UtilisateurScalarFieldEnum: {
    id_utilisateur: 'id_utilisateur',
    prenom: 'prenom',
    nom: 'nom',
    email: 'email',
    mot_de_passe: 'mot_de_passe',
    role: 'role',
    photo_profil: 'photo_profil',
    biographie: 'biographie',
    date_inscription: 'date_inscription',
    telephone: 'telephone',
    adresse: 'adresse',
    note_moyenne: 'note_moyenne'
  };

  export type UtilisateurScalarFieldEnum = (typeof UtilisateurScalarFieldEnum)[keyof typeof UtilisateurScalarFieldEnum]


  export const CompetenceScalarFieldEnum: {
    id_competence: 'id_competence',
    nom: 'nom'
  };

  export type CompetenceScalarFieldEnum = (typeof CompetenceScalarFieldEnum)[keyof typeof CompetenceScalarFieldEnum]


  export const UtilisateurCompetenceScalarFieldEnum: {
    id_utilisateur_competence: 'id_utilisateur_competence',
    id_utilisateur: 'id_utilisateur',
    id_competence: 'id_competence'
  };

  export type UtilisateurCompetenceScalarFieldEnum = (typeof UtilisateurCompetenceScalarFieldEnum)[keyof typeof UtilisateurCompetenceScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type avisWhereInput = {
    AND?: avisWhereInput | avisWhereInput[]
    OR?: avisWhereInput[]
    NOT?: avisWhereInput | avisWhereInput[]
    id_avis?: BigIntFilter<"avis"> | bigint | number
    id_utilisateur?: BigIntNullableFilter<"avis"> | bigint | number | null
    id_jardin?: BigIntNullableFilter<"avis"> | bigint | number | null
    note?: IntNullableFilter<"avis"> | number | null
    commentaire?: StringNullableFilter<"avis"> | string | null
    date_avis?: DateTimeNullableFilter<"avis"> | Date | string | null
    jardin?: XOR<JardinNullableScalarRelationFilter, jardinWhereInput> | null
    utilisateur?: XOR<UtilisateurNullableScalarRelationFilter, utilisateurWhereInput> | null
  }

  export type avisOrderByWithRelationInput = {
    id_avis?: SortOrder
    id_utilisateur?: SortOrderInput | SortOrder
    id_jardin?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    commentaire?: SortOrderInput | SortOrder
    date_avis?: SortOrderInput | SortOrder
    jardin?: jardinOrderByWithRelationInput
    utilisateur?: utilisateurOrderByWithRelationInput
  }

  export type avisWhereUniqueInput = Prisma.AtLeast<{
    id_avis?: bigint | number
    AND?: avisWhereInput | avisWhereInput[]
    OR?: avisWhereInput[]
    NOT?: avisWhereInput | avisWhereInput[]
    id_utilisateur?: BigIntNullableFilter<"avis"> | bigint | number | null
    id_jardin?: BigIntNullableFilter<"avis"> | bigint | number | null
    note?: IntNullableFilter<"avis"> | number | null
    commentaire?: StringNullableFilter<"avis"> | string | null
    date_avis?: DateTimeNullableFilter<"avis"> | Date | string | null
    jardin?: XOR<JardinNullableScalarRelationFilter, jardinWhereInput> | null
    utilisateur?: XOR<UtilisateurNullableScalarRelationFilter, utilisateurWhereInput> | null
  }, "id_avis">

  export type avisOrderByWithAggregationInput = {
    id_avis?: SortOrder
    id_utilisateur?: SortOrderInput | SortOrder
    id_jardin?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    commentaire?: SortOrderInput | SortOrder
    date_avis?: SortOrderInput | SortOrder
    _count?: avisCountOrderByAggregateInput
    _avg?: avisAvgOrderByAggregateInput
    _max?: avisMaxOrderByAggregateInput
    _min?: avisMinOrderByAggregateInput
    _sum?: avisSumOrderByAggregateInput
  }

  export type avisScalarWhereWithAggregatesInput = {
    AND?: avisScalarWhereWithAggregatesInput | avisScalarWhereWithAggregatesInput[]
    OR?: avisScalarWhereWithAggregatesInput[]
    NOT?: avisScalarWhereWithAggregatesInput | avisScalarWhereWithAggregatesInput[]
    id_avis?: BigIntWithAggregatesFilter<"avis"> | bigint | number
    id_utilisateur?: BigIntNullableWithAggregatesFilter<"avis"> | bigint | number | null
    id_jardin?: BigIntNullableWithAggregatesFilter<"avis"> | bigint | number | null
    note?: IntNullableWithAggregatesFilter<"avis"> | number | null
    commentaire?: StringNullableWithAggregatesFilter<"avis"> | string | null
    date_avis?: DateTimeNullableWithAggregatesFilter<"avis"> | Date | string | null
  }

  export type disponibilitesWhereInput = {
    AND?: disponibilitesWhereInput | disponibilitesWhereInput[]
    OR?: disponibilitesWhereInput[]
    NOT?: disponibilitesWhereInput | disponibilitesWhereInput[]
    id_disponibilite?: BigIntFilter<"disponibilites"> | bigint | number
    id_jardin?: BigIntNullableFilter<"disponibilites"> | bigint | number | null
    date_dispo?: DateTimeNullableFilter<"disponibilites"> | Date | string | null
    heure_debut?: DateTimeNullableFilter<"disponibilites"> | Date | string | null
    heure_fin?: DateTimeNullableFilter<"disponibilites"> | Date | string | null
    statut?: StringNullableFilter<"disponibilites"> | string | null
    jardin?: XOR<JardinNullableScalarRelationFilter, jardinWhereInput> | null
    reservation?: ReservationListRelationFilter
  }

  export type disponibilitesOrderByWithRelationInput = {
    id_disponibilite?: SortOrder
    id_jardin?: SortOrderInput | SortOrder
    date_dispo?: SortOrderInput | SortOrder
    heure_debut?: SortOrderInput | SortOrder
    heure_fin?: SortOrderInput | SortOrder
    statut?: SortOrderInput | SortOrder
    jardin?: jardinOrderByWithRelationInput
    reservation?: reservationOrderByRelationAggregateInput
  }

  export type disponibilitesWhereUniqueInput = Prisma.AtLeast<{
    id_disponibilite?: bigint | number
    AND?: disponibilitesWhereInput | disponibilitesWhereInput[]
    OR?: disponibilitesWhereInput[]
    NOT?: disponibilitesWhereInput | disponibilitesWhereInput[]
    id_jardin?: BigIntNullableFilter<"disponibilites"> | bigint | number | null
    date_dispo?: DateTimeNullableFilter<"disponibilites"> | Date | string | null
    heure_debut?: DateTimeNullableFilter<"disponibilites"> | Date | string | null
    heure_fin?: DateTimeNullableFilter<"disponibilites"> | Date | string | null
    statut?: StringNullableFilter<"disponibilites"> | string | null
    jardin?: XOR<JardinNullableScalarRelationFilter, jardinWhereInput> | null
    reservation?: ReservationListRelationFilter
  }, "id_disponibilite">

  export type disponibilitesOrderByWithAggregationInput = {
    id_disponibilite?: SortOrder
    id_jardin?: SortOrderInput | SortOrder
    date_dispo?: SortOrderInput | SortOrder
    heure_debut?: SortOrderInput | SortOrder
    heure_fin?: SortOrderInput | SortOrder
    statut?: SortOrderInput | SortOrder
    _count?: disponibilitesCountOrderByAggregateInput
    _avg?: disponibilitesAvgOrderByAggregateInput
    _max?: disponibilitesMaxOrderByAggregateInput
    _min?: disponibilitesMinOrderByAggregateInput
    _sum?: disponibilitesSumOrderByAggregateInput
  }

  export type disponibilitesScalarWhereWithAggregatesInput = {
    AND?: disponibilitesScalarWhereWithAggregatesInput | disponibilitesScalarWhereWithAggregatesInput[]
    OR?: disponibilitesScalarWhereWithAggregatesInput[]
    NOT?: disponibilitesScalarWhereWithAggregatesInput | disponibilitesScalarWhereWithAggregatesInput[]
    id_disponibilite?: BigIntWithAggregatesFilter<"disponibilites"> | bigint | number
    id_jardin?: BigIntNullableWithAggregatesFilter<"disponibilites"> | bigint | number | null
    date_dispo?: DateTimeNullableWithAggregatesFilter<"disponibilites"> | Date | string | null
    heure_debut?: DateTimeNullableWithAggregatesFilter<"disponibilites"> | Date | string | null
    heure_fin?: DateTimeNullableWithAggregatesFilter<"disponibilites"> | Date | string | null
    statut?: StringNullableWithAggregatesFilter<"disponibilites"> | string | null
  }

  export type heurescumul_esWhereInput = {
    AND?: heurescumul_esWhereInput | heurescumul_esWhereInput[]
    OR?: heurescumul_esWhereInput[]
    NOT?: heurescumul_esWhereInput | heurescumul_esWhereInput[]
    id_historique?: BigIntFilter<"heurescumul_es"> | bigint | number
    id_utilisateur?: BigIntNullableFilter<"heurescumul_es"> | bigint | number | null
    heures_travaillees?: FloatNullableFilter<"heurescumul_es"> | number | null
    date_maj?: DateTimeNullableFilter<"heurescumul_es"> | Date | string | null
    utilisateur?: XOR<UtilisateurNullableScalarRelationFilter, utilisateurWhereInput> | null
  }

  export type heurescumul_esOrderByWithRelationInput = {
    id_historique?: SortOrder
    id_utilisateur?: SortOrderInput | SortOrder
    heures_travaillees?: SortOrderInput | SortOrder
    date_maj?: SortOrderInput | SortOrder
    utilisateur?: utilisateurOrderByWithRelationInput
  }

  export type heurescumul_esWhereUniqueInput = Prisma.AtLeast<{
    id_historique?: bigint | number
    AND?: heurescumul_esWhereInput | heurescumul_esWhereInput[]
    OR?: heurescumul_esWhereInput[]
    NOT?: heurescumul_esWhereInput | heurescumul_esWhereInput[]
    id_utilisateur?: BigIntNullableFilter<"heurescumul_es"> | bigint | number | null
    heures_travaillees?: FloatNullableFilter<"heurescumul_es"> | number | null
    date_maj?: DateTimeNullableFilter<"heurescumul_es"> | Date | string | null
    utilisateur?: XOR<UtilisateurNullableScalarRelationFilter, utilisateurWhereInput> | null
  }, "id_historique">

  export type heurescumul_esOrderByWithAggregationInput = {
    id_historique?: SortOrder
    id_utilisateur?: SortOrderInput | SortOrder
    heures_travaillees?: SortOrderInput | SortOrder
    date_maj?: SortOrderInput | SortOrder
    _count?: heurescumul_esCountOrderByAggregateInput
    _avg?: heurescumul_esAvgOrderByAggregateInput
    _max?: heurescumul_esMaxOrderByAggregateInput
    _min?: heurescumul_esMinOrderByAggregateInput
    _sum?: heurescumul_esSumOrderByAggregateInput
  }

  export type heurescumul_esScalarWhereWithAggregatesInput = {
    AND?: heurescumul_esScalarWhereWithAggregatesInput | heurescumul_esScalarWhereWithAggregatesInput[]
    OR?: heurescumul_esScalarWhereWithAggregatesInput[]
    NOT?: heurescumul_esScalarWhereWithAggregatesInput | heurescumul_esScalarWhereWithAggregatesInput[]
    id_historique?: BigIntWithAggregatesFilter<"heurescumul_es"> | bigint | number
    id_utilisateur?: BigIntNullableWithAggregatesFilter<"heurescumul_es"> | bigint | number | null
    heures_travaillees?: FloatNullableWithAggregatesFilter<"heurescumul_es"> | number | null
    date_maj?: DateTimeNullableWithAggregatesFilter<"heurescumul_es"> | Date | string | null
  }

  export type jardinWhereInput = {
    AND?: jardinWhereInput | jardinWhereInput[]
    OR?: jardinWhereInput[]
    NOT?: jardinWhereInput | jardinWhereInput[]
    id_jardin?: BigIntFilter<"jardin"> | bigint | number
    id_proprietaire?: BigIntFilter<"jardin"> | bigint | number
    titre?: StringNullableFilter<"jardin"> | string | null
    description?: StringNullableFilter<"jardin"> | string | null
    adresse?: StringNullableFilter<"jardin"> | string | null
    superficie?: FloatNullableFilter<"jardin"> | number | null
    type?: StringNullableFilter<"jardin"> | string | null
    besoins?: StringNullableFilter<"jardin"> | string | null
    photos?: JsonNullableFilter<"jardin">
    date_publication?: DateTimeNullableFilter<"jardin"> | Date | string | null
    statut?: StringNullableFilter<"jardin"> | string | null
    note_moyenne?: FloatNullableFilter<"jardin"> | number | null
    avis?: AvisListRelationFilter
    disponibilites?: DisponibilitesListRelationFilter
    utilisateur?: XOR<UtilisateurScalarRelationFilter, utilisateurWhereInput>
    reservation?: ReservationListRelationFilter
  }

  export type jardinOrderByWithRelationInput = {
    id_jardin?: SortOrder
    id_proprietaire?: SortOrder
    titre?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    adresse?: SortOrderInput | SortOrder
    superficie?: SortOrderInput | SortOrder
    type?: SortOrderInput | SortOrder
    besoins?: SortOrderInput | SortOrder
    photos?: SortOrderInput | SortOrder
    date_publication?: SortOrderInput | SortOrder
    statut?: SortOrderInput | SortOrder
    note_moyenne?: SortOrderInput | SortOrder
    avis?: avisOrderByRelationAggregateInput
    disponibilites?: disponibilitesOrderByRelationAggregateInput
    utilisateur?: utilisateurOrderByWithRelationInput
    reservation?: reservationOrderByRelationAggregateInput
  }

  export type jardinWhereUniqueInput = Prisma.AtLeast<{
    id_jardin?: bigint | number
    id_proprietaire?: bigint | number
    AND?: jardinWhereInput | jardinWhereInput[]
    OR?: jardinWhereInput[]
    NOT?: jardinWhereInput | jardinWhereInput[]
    titre?: StringNullableFilter<"jardin"> | string | null
    description?: StringNullableFilter<"jardin"> | string | null
    adresse?: StringNullableFilter<"jardin"> | string | null
    superficie?: FloatNullableFilter<"jardin"> | number | null
    type?: StringNullableFilter<"jardin"> | string | null
    besoins?: StringNullableFilter<"jardin"> | string | null
    photos?: JsonNullableFilter<"jardin">
    date_publication?: DateTimeNullableFilter<"jardin"> | Date | string | null
    statut?: StringNullableFilter<"jardin"> | string | null
    note_moyenne?: FloatNullableFilter<"jardin"> | number | null
    avis?: AvisListRelationFilter
    disponibilites?: DisponibilitesListRelationFilter
    utilisateur?: XOR<UtilisateurScalarRelationFilter, utilisateurWhereInput>
    reservation?: ReservationListRelationFilter
  }, "id_jardin" | "id_proprietaire">

  export type jardinOrderByWithAggregationInput = {
    id_jardin?: SortOrder
    id_proprietaire?: SortOrder
    titre?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    adresse?: SortOrderInput | SortOrder
    superficie?: SortOrderInput | SortOrder
    type?: SortOrderInput | SortOrder
    besoins?: SortOrderInput | SortOrder
    photos?: SortOrderInput | SortOrder
    date_publication?: SortOrderInput | SortOrder
    statut?: SortOrderInput | SortOrder
    note_moyenne?: SortOrderInput | SortOrder
    _count?: jardinCountOrderByAggregateInput
    _avg?: jardinAvgOrderByAggregateInput
    _max?: jardinMaxOrderByAggregateInput
    _min?: jardinMinOrderByAggregateInput
    _sum?: jardinSumOrderByAggregateInput
  }

  export type jardinScalarWhereWithAggregatesInput = {
    AND?: jardinScalarWhereWithAggregatesInput | jardinScalarWhereWithAggregatesInput[]
    OR?: jardinScalarWhereWithAggregatesInput[]
    NOT?: jardinScalarWhereWithAggregatesInput | jardinScalarWhereWithAggregatesInput[]
    id_jardin?: BigIntWithAggregatesFilter<"jardin"> | bigint | number
    id_proprietaire?: BigIntWithAggregatesFilter<"jardin"> | bigint | number
    titre?: StringNullableWithAggregatesFilter<"jardin"> | string | null
    description?: StringNullableWithAggregatesFilter<"jardin"> | string | null
    adresse?: StringNullableWithAggregatesFilter<"jardin"> | string | null
    superficie?: FloatNullableWithAggregatesFilter<"jardin"> | number | null
    type?: StringNullableWithAggregatesFilter<"jardin"> | string | null
    besoins?: StringNullableWithAggregatesFilter<"jardin"> | string | null
    photos?: JsonNullableWithAggregatesFilter<"jardin">
    date_publication?: DateTimeNullableWithAggregatesFilter<"jardin"> | Date | string | null
    statut?: StringNullableWithAggregatesFilter<"jardin"> | string | null
    note_moyenne?: FloatNullableWithAggregatesFilter<"jardin"> | number | null
  }

  export type messagerieWhereInput = {
    AND?: messagerieWhereInput | messagerieWhereInput[]
    OR?: messagerieWhereInput[]
    NOT?: messagerieWhereInput | messagerieWhereInput[]
    id_message?: BigIntFilter<"messagerie"> | bigint | number
    id_envoyeur?: BigIntNullableFilter<"messagerie"> | bigint | number | null
    id_destinataire?: BigIntNullableFilter<"messagerie"> | bigint | number | null
    contenu?: StringNullableFilter<"messagerie"> | string | null
    date_envoi?: DateTimeNullableFilter<"messagerie"> | Date | string | null
    lu?: BoolNullableFilter<"messagerie"> | boolean | null
    utilisateur_messagerie_id_destinataireToutilisateur?: XOR<UtilisateurNullableScalarRelationFilter, utilisateurWhereInput> | null
    utilisateur_messagerie_id_envoyeurToutilisateur?: XOR<UtilisateurNullableScalarRelationFilter, utilisateurWhereInput> | null
  }

  export type messagerieOrderByWithRelationInput = {
    id_message?: SortOrder
    id_envoyeur?: SortOrderInput | SortOrder
    id_destinataire?: SortOrderInput | SortOrder
    contenu?: SortOrderInput | SortOrder
    date_envoi?: SortOrderInput | SortOrder
    lu?: SortOrderInput | SortOrder
    utilisateur_messagerie_id_destinataireToutilisateur?: utilisateurOrderByWithRelationInput
    utilisateur_messagerie_id_envoyeurToutilisateur?: utilisateurOrderByWithRelationInput
  }

  export type messagerieWhereUniqueInput = Prisma.AtLeast<{
    id_message?: bigint | number
    AND?: messagerieWhereInput | messagerieWhereInput[]
    OR?: messagerieWhereInput[]
    NOT?: messagerieWhereInput | messagerieWhereInput[]
    id_envoyeur?: BigIntNullableFilter<"messagerie"> | bigint | number | null
    id_destinataire?: BigIntNullableFilter<"messagerie"> | bigint | number | null
    contenu?: StringNullableFilter<"messagerie"> | string | null
    date_envoi?: DateTimeNullableFilter<"messagerie"> | Date | string | null
    lu?: BoolNullableFilter<"messagerie"> | boolean | null
    utilisateur_messagerie_id_destinataireToutilisateur?: XOR<UtilisateurNullableScalarRelationFilter, utilisateurWhereInput> | null
    utilisateur_messagerie_id_envoyeurToutilisateur?: XOR<UtilisateurNullableScalarRelationFilter, utilisateurWhereInput> | null
  }, "id_message">

  export type messagerieOrderByWithAggregationInput = {
    id_message?: SortOrder
    id_envoyeur?: SortOrderInput | SortOrder
    id_destinataire?: SortOrderInput | SortOrder
    contenu?: SortOrderInput | SortOrder
    date_envoi?: SortOrderInput | SortOrder
    lu?: SortOrderInput | SortOrder
    _count?: messagerieCountOrderByAggregateInput
    _avg?: messagerieAvgOrderByAggregateInput
    _max?: messagerieMaxOrderByAggregateInput
    _min?: messagerieMinOrderByAggregateInput
    _sum?: messagerieSumOrderByAggregateInput
  }

  export type messagerieScalarWhereWithAggregatesInput = {
    AND?: messagerieScalarWhereWithAggregatesInput | messagerieScalarWhereWithAggregatesInput[]
    OR?: messagerieScalarWhereWithAggregatesInput[]
    NOT?: messagerieScalarWhereWithAggregatesInput | messagerieScalarWhereWithAggregatesInput[]
    id_message?: BigIntWithAggregatesFilter<"messagerie"> | bigint | number
    id_envoyeur?: BigIntNullableWithAggregatesFilter<"messagerie"> | bigint | number | null
    id_destinataire?: BigIntNullableWithAggregatesFilter<"messagerie"> | bigint | number | null
    contenu?: StringNullableWithAggregatesFilter<"messagerie"> | string | null
    date_envoi?: DateTimeNullableWithAggregatesFilter<"messagerie"> | Date | string | null
    lu?: BoolNullableWithAggregatesFilter<"messagerie"> | boolean | null
  }

  export type reservationWhereInput = {
    AND?: reservationWhereInput | reservationWhereInput[]
    OR?: reservationWhereInput[]
    NOT?: reservationWhereInput | reservationWhereInput[]
    id_reservation?: BigIntFilter<"reservation"> | bigint | number
    id_utilisateur?: BigIntNullableFilter<"reservation"> | bigint | number | null
    id_jardin?: BigIntNullableFilter<"reservation"> | bigint | number | null
    id_disponibilite?: BigIntNullableFilter<"reservation"> | bigint | number | null
    statut?: StringNullableFilter<"reservation"> | string | null
    date_reservation?: DateTimeNullableFilter<"reservation"> | Date | string | null
    commentaires?: StringNullableFilter<"reservation"> | string | null
    disponibilites?: XOR<DisponibilitesNullableScalarRelationFilter, disponibilitesWhereInput> | null
    jardin?: XOR<JardinNullableScalarRelationFilter, jardinWhereInput> | null
    utilisateur?: XOR<UtilisateurNullableScalarRelationFilter, utilisateurWhereInput> | null
  }

  export type reservationOrderByWithRelationInput = {
    id_reservation?: SortOrder
    id_utilisateur?: SortOrderInput | SortOrder
    id_jardin?: SortOrderInput | SortOrder
    id_disponibilite?: SortOrderInput | SortOrder
    statut?: SortOrderInput | SortOrder
    date_reservation?: SortOrderInput | SortOrder
    commentaires?: SortOrderInput | SortOrder
    disponibilites?: disponibilitesOrderByWithRelationInput
    jardin?: jardinOrderByWithRelationInput
    utilisateur?: utilisateurOrderByWithRelationInput
  }

  export type reservationWhereUniqueInput = Prisma.AtLeast<{
    id_reservation?: bigint | number
    AND?: reservationWhereInput | reservationWhereInput[]
    OR?: reservationWhereInput[]
    NOT?: reservationWhereInput | reservationWhereInput[]
    id_utilisateur?: BigIntNullableFilter<"reservation"> | bigint | number | null
    id_jardin?: BigIntNullableFilter<"reservation"> | bigint | number | null
    id_disponibilite?: BigIntNullableFilter<"reservation"> | bigint | number | null
    statut?: StringNullableFilter<"reservation"> | string | null
    date_reservation?: DateTimeNullableFilter<"reservation"> | Date | string | null
    commentaires?: StringNullableFilter<"reservation"> | string | null
    disponibilites?: XOR<DisponibilitesNullableScalarRelationFilter, disponibilitesWhereInput> | null
    jardin?: XOR<JardinNullableScalarRelationFilter, jardinWhereInput> | null
    utilisateur?: XOR<UtilisateurNullableScalarRelationFilter, utilisateurWhereInput> | null
  }, "id_reservation">

  export type reservationOrderByWithAggregationInput = {
    id_reservation?: SortOrder
    id_utilisateur?: SortOrderInput | SortOrder
    id_jardin?: SortOrderInput | SortOrder
    id_disponibilite?: SortOrderInput | SortOrder
    statut?: SortOrderInput | SortOrder
    date_reservation?: SortOrderInput | SortOrder
    commentaires?: SortOrderInput | SortOrder
    _count?: reservationCountOrderByAggregateInput
    _avg?: reservationAvgOrderByAggregateInput
    _max?: reservationMaxOrderByAggregateInput
    _min?: reservationMinOrderByAggregateInput
    _sum?: reservationSumOrderByAggregateInput
  }

  export type reservationScalarWhereWithAggregatesInput = {
    AND?: reservationScalarWhereWithAggregatesInput | reservationScalarWhereWithAggregatesInput[]
    OR?: reservationScalarWhereWithAggregatesInput[]
    NOT?: reservationScalarWhereWithAggregatesInput | reservationScalarWhereWithAggregatesInput[]
    id_reservation?: BigIntWithAggregatesFilter<"reservation"> | bigint | number
    id_utilisateur?: BigIntNullableWithAggregatesFilter<"reservation"> | bigint | number | null
    id_jardin?: BigIntNullableWithAggregatesFilter<"reservation"> | bigint | number | null
    id_disponibilite?: BigIntNullableWithAggregatesFilter<"reservation"> | bigint | number | null
    statut?: StringNullableWithAggregatesFilter<"reservation"> | string | null
    date_reservation?: DateTimeNullableWithAggregatesFilter<"reservation"> | Date | string | null
    commentaires?: StringNullableWithAggregatesFilter<"reservation"> | string | null
  }

  export type utilisateurWhereInput = {
    AND?: utilisateurWhereInput | utilisateurWhereInput[]
    OR?: utilisateurWhereInput[]
    NOT?: utilisateurWhereInput | utilisateurWhereInput[]
    id_utilisateur?: BigIntFilter<"utilisateur"> | bigint | number
    prenom?: StringNullableFilter<"utilisateur"> | string | null
    nom?: StringNullableFilter<"utilisateur"> | string | null
    email?: StringNullableFilter<"utilisateur"> | string | null
    mot_de_passe?: StringNullableFilter<"utilisateur"> | string | null
    role?: StringNullableFilter<"utilisateur"> | string | null
    photo_profil?: StringNullableFilter<"utilisateur"> | string | null
    biographie?: StringNullableFilter<"utilisateur"> | string | null
    date_inscription?: DateTimeNullableFilter<"utilisateur"> | Date | string | null
    telephone?: StringNullableFilter<"utilisateur"> | string | null
    adresse?: StringNullableFilter<"utilisateur"> | string | null
    note_moyenne?: FloatNullableFilter<"utilisateur"> | number | null
    avis?: AvisListRelationFilter
    heurescumul_es?: Heurescumul_esListRelationFilter
    jardin?: XOR<JardinNullableScalarRelationFilter, jardinWhereInput> | null
    messagerie_messagerie_id_destinataireToutilisateur?: MessagerieListRelationFilter
    messagerie_messagerie_id_envoyeurToutilisateur?: MessagerieListRelationFilter
    reservation?: ReservationListRelationFilter
    competences?: UtilisateurCompetenceListRelationFilter
  }

  export type utilisateurOrderByWithRelationInput = {
    id_utilisateur?: SortOrder
    prenom?: SortOrderInput | SortOrder
    nom?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    mot_de_passe?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    photo_profil?: SortOrderInput | SortOrder
    biographie?: SortOrderInput | SortOrder
    date_inscription?: SortOrderInput | SortOrder
    telephone?: SortOrderInput | SortOrder
    adresse?: SortOrderInput | SortOrder
    note_moyenne?: SortOrderInput | SortOrder
    avis?: avisOrderByRelationAggregateInput
    heurescumul_es?: heurescumul_esOrderByRelationAggregateInput
    jardin?: jardinOrderByWithRelationInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieOrderByRelationAggregateInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieOrderByRelationAggregateInput
    reservation?: reservationOrderByRelationAggregateInput
    competences?: utilisateurCompetenceOrderByRelationAggregateInput
  }

  export type utilisateurWhereUniqueInput = Prisma.AtLeast<{
    id_utilisateur?: bigint | number
    email?: string
    AND?: utilisateurWhereInput | utilisateurWhereInput[]
    OR?: utilisateurWhereInput[]
    NOT?: utilisateurWhereInput | utilisateurWhereInput[]
    prenom?: StringNullableFilter<"utilisateur"> | string | null
    nom?: StringNullableFilter<"utilisateur"> | string | null
    mot_de_passe?: StringNullableFilter<"utilisateur"> | string | null
    role?: StringNullableFilter<"utilisateur"> | string | null
    photo_profil?: StringNullableFilter<"utilisateur"> | string | null
    biographie?: StringNullableFilter<"utilisateur"> | string | null
    date_inscription?: DateTimeNullableFilter<"utilisateur"> | Date | string | null
    telephone?: StringNullableFilter<"utilisateur"> | string | null
    adresse?: StringNullableFilter<"utilisateur"> | string | null
    note_moyenne?: FloatNullableFilter<"utilisateur"> | number | null
    avis?: AvisListRelationFilter
    heurescumul_es?: Heurescumul_esListRelationFilter
    jardin?: XOR<JardinNullableScalarRelationFilter, jardinWhereInput> | null
    messagerie_messagerie_id_destinataireToutilisateur?: MessagerieListRelationFilter
    messagerie_messagerie_id_envoyeurToutilisateur?: MessagerieListRelationFilter
    reservation?: ReservationListRelationFilter
    competences?: UtilisateurCompetenceListRelationFilter
  }, "id_utilisateur" | "email">

  export type utilisateurOrderByWithAggregationInput = {
    id_utilisateur?: SortOrder
    prenom?: SortOrderInput | SortOrder
    nom?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    mot_de_passe?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    photo_profil?: SortOrderInput | SortOrder
    biographie?: SortOrderInput | SortOrder
    date_inscription?: SortOrderInput | SortOrder
    telephone?: SortOrderInput | SortOrder
    adresse?: SortOrderInput | SortOrder
    note_moyenne?: SortOrderInput | SortOrder
    _count?: utilisateurCountOrderByAggregateInput
    _avg?: utilisateurAvgOrderByAggregateInput
    _max?: utilisateurMaxOrderByAggregateInput
    _min?: utilisateurMinOrderByAggregateInput
    _sum?: utilisateurSumOrderByAggregateInput
  }

  export type utilisateurScalarWhereWithAggregatesInput = {
    AND?: utilisateurScalarWhereWithAggregatesInput | utilisateurScalarWhereWithAggregatesInput[]
    OR?: utilisateurScalarWhereWithAggregatesInput[]
    NOT?: utilisateurScalarWhereWithAggregatesInput | utilisateurScalarWhereWithAggregatesInput[]
    id_utilisateur?: BigIntWithAggregatesFilter<"utilisateur"> | bigint | number
    prenom?: StringNullableWithAggregatesFilter<"utilisateur"> | string | null
    nom?: StringNullableWithAggregatesFilter<"utilisateur"> | string | null
    email?: StringNullableWithAggregatesFilter<"utilisateur"> | string | null
    mot_de_passe?: StringNullableWithAggregatesFilter<"utilisateur"> | string | null
    role?: StringNullableWithAggregatesFilter<"utilisateur"> | string | null
    photo_profil?: StringNullableWithAggregatesFilter<"utilisateur"> | string | null
    biographie?: StringNullableWithAggregatesFilter<"utilisateur"> | string | null
    date_inscription?: DateTimeNullableWithAggregatesFilter<"utilisateur"> | Date | string | null
    telephone?: StringNullableWithAggregatesFilter<"utilisateur"> | string | null
    adresse?: StringNullableWithAggregatesFilter<"utilisateur"> | string | null
    note_moyenne?: FloatNullableWithAggregatesFilter<"utilisateur"> | number | null
  }

  export type competenceWhereInput = {
    AND?: competenceWhereInput | competenceWhereInput[]
    OR?: competenceWhereInput[]
    NOT?: competenceWhereInput | competenceWhereInput[]
    id_competence?: IntFilter<"competence"> | number
    nom?: StringFilter<"competence"> | string
    utilisateurs?: UtilisateurCompetenceListRelationFilter
  }

  export type competenceOrderByWithRelationInput = {
    id_competence?: SortOrder
    nom?: SortOrder
    utilisateurs?: utilisateurCompetenceOrderByRelationAggregateInput
  }

  export type competenceWhereUniqueInput = Prisma.AtLeast<{
    id_competence?: number
    nom?: string
    AND?: competenceWhereInput | competenceWhereInput[]
    OR?: competenceWhereInput[]
    NOT?: competenceWhereInput | competenceWhereInput[]
    utilisateurs?: UtilisateurCompetenceListRelationFilter
  }, "id_competence" | "nom">

  export type competenceOrderByWithAggregationInput = {
    id_competence?: SortOrder
    nom?: SortOrder
    _count?: competenceCountOrderByAggregateInput
    _avg?: competenceAvgOrderByAggregateInput
    _max?: competenceMaxOrderByAggregateInput
    _min?: competenceMinOrderByAggregateInput
    _sum?: competenceSumOrderByAggregateInput
  }

  export type competenceScalarWhereWithAggregatesInput = {
    AND?: competenceScalarWhereWithAggregatesInput | competenceScalarWhereWithAggregatesInput[]
    OR?: competenceScalarWhereWithAggregatesInput[]
    NOT?: competenceScalarWhereWithAggregatesInput | competenceScalarWhereWithAggregatesInput[]
    id_competence?: IntWithAggregatesFilter<"competence"> | number
    nom?: StringWithAggregatesFilter<"competence"> | string
  }

  export type utilisateurCompetenceWhereInput = {
    AND?: utilisateurCompetenceWhereInput | utilisateurCompetenceWhereInput[]
    OR?: utilisateurCompetenceWhereInput[]
    NOT?: utilisateurCompetenceWhereInput | utilisateurCompetenceWhereInput[]
    id_utilisateur_competence?: IntFilter<"utilisateurCompetence"> | number
    id_utilisateur?: BigIntFilter<"utilisateurCompetence"> | bigint | number
    id_competence?: IntFilter<"utilisateurCompetence"> | number
    utilisateur?: XOR<UtilisateurScalarRelationFilter, utilisateurWhereInput>
    competence?: XOR<CompetenceScalarRelationFilter, competenceWhereInput>
  }

  export type utilisateurCompetenceOrderByWithRelationInput = {
    id_utilisateur_competence?: SortOrder
    id_utilisateur?: SortOrder
    id_competence?: SortOrder
    utilisateur?: utilisateurOrderByWithRelationInput
    competence?: competenceOrderByWithRelationInput
  }

  export type utilisateurCompetenceWhereUniqueInput = Prisma.AtLeast<{
    id_utilisateur_competence?: number
    AND?: utilisateurCompetenceWhereInput | utilisateurCompetenceWhereInput[]
    OR?: utilisateurCompetenceWhereInput[]
    NOT?: utilisateurCompetenceWhereInput | utilisateurCompetenceWhereInput[]
    id_utilisateur?: BigIntFilter<"utilisateurCompetence"> | bigint | number
    id_competence?: IntFilter<"utilisateurCompetence"> | number
    utilisateur?: XOR<UtilisateurScalarRelationFilter, utilisateurWhereInput>
    competence?: XOR<CompetenceScalarRelationFilter, competenceWhereInput>
  }, "id_utilisateur_competence">

  export type utilisateurCompetenceOrderByWithAggregationInput = {
    id_utilisateur_competence?: SortOrder
    id_utilisateur?: SortOrder
    id_competence?: SortOrder
    _count?: utilisateurCompetenceCountOrderByAggregateInput
    _avg?: utilisateurCompetenceAvgOrderByAggregateInput
    _max?: utilisateurCompetenceMaxOrderByAggregateInput
    _min?: utilisateurCompetenceMinOrderByAggregateInput
    _sum?: utilisateurCompetenceSumOrderByAggregateInput
  }

  export type utilisateurCompetenceScalarWhereWithAggregatesInput = {
    AND?: utilisateurCompetenceScalarWhereWithAggregatesInput | utilisateurCompetenceScalarWhereWithAggregatesInput[]
    OR?: utilisateurCompetenceScalarWhereWithAggregatesInput[]
    NOT?: utilisateurCompetenceScalarWhereWithAggregatesInput | utilisateurCompetenceScalarWhereWithAggregatesInput[]
    id_utilisateur_competence?: IntWithAggregatesFilter<"utilisateurCompetence"> | number
    id_utilisateur?: BigIntWithAggregatesFilter<"utilisateurCompetence"> | bigint | number
    id_competence?: IntWithAggregatesFilter<"utilisateurCompetence"> | number
  }

  export type avisCreateInput = {
    id_avis?: bigint | number
    note?: number | null
    commentaire?: string | null
    date_avis?: Date | string | null
    jardin?: jardinCreateNestedOneWithoutAvisInput
    utilisateur?: utilisateurCreateNestedOneWithoutAvisInput
  }

  export type avisUncheckedCreateInput = {
    id_avis?: bigint | number
    id_utilisateur?: bigint | number | null
    id_jardin?: bigint | number | null
    note?: number | null
    commentaire?: string | null
    date_avis?: Date | string | null
  }

  export type avisUpdateInput = {
    id_avis?: BigIntFieldUpdateOperationsInput | bigint | number
    note?: NullableIntFieldUpdateOperationsInput | number | null
    commentaire?: NullableStringFieldUpdateOperationsInput | string | null
    date_avis?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    jardin?: jardinUpdateOneWithoutAvisNestedInput
    utilisateur?: utilisateurUpdateOneWithoutAvisNestedInput
  }

  export type avisUncheckedUpdateInput = {
    id_avis?: BigIntFieldUpdateOperationsInput | bigint | number
    id_utilisateur?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    id_jardin?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    note?: NullableIntFieldUpdateOperationsInput | number | null
    commentaire?: NullableStringFieldUpdateOperationsInput | string | null
    date_avis?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type avisCreateManyInput = {
    id_avis?: bigint | number
    id_utilisateur?: bigint | number | null
    id_jardin?: bigint | number | null
    note?: number | null
    commentaire?: string | null
    date_avis?: Date | string | null
  }

  export type avisUpdateManyMutationInput = {
    id_avis?: BigIntFieldUpdateOperationsInput | bigint | number
    note?: NullableIntFieldUpdateOperationsInput | number | null
    commentaire?: NullableStringFieldUpdateOperationsInput | string | null
    date_avis?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type avisUncheckedUpdateManyInput = {
    id_avis?: BigIntFieldUpdateOperationsInput | bigint | number
    id_utilisateur?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    id_jardin?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    note?: NullableIntFieldUpdateOperationsInput | number | null
    commentaire?: NullableStringFieldUpdateOperationsInput | string | null
    date_avis?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type disponibilitesCreateInput = {
    id_disponibilite?: bigint | number
    date_dispo?: Date | string | null
    heure_debut?: Date | string | null
    heure_fin?: Date | string | null
    statut?: string | null
    jardin?: jardinCreateNestedOneWithoutDisponibilitesInput
    reservation?: reservationCreateNestedManyWithoutDisponibilitesInput
  }

  export type disponibilitesUncheckedCreateInput = {
    id_disponibilite?: bigint | number
    id_jardin?: bigint | number | null
    date_dispo?: Date | string | null
    heure_debut?: Date | string | null
    heure_fin?: Date | string | null
    statut?: string | null
    reservation?: reservationUncheckedCreateNestedManyWithoutDisponibilitesInput
  }

  export type disponibilitesUpdateInput = {
    id_disponibilite?: BigIntFieldUpdateOperationsInput | bigint | number
    date_dispo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    heure_debut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    heure_fin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    jardin?: jardinUpdateOneWithoutDisponibilitesNestedInput
    reservation?: reservationUpdateManyWithoutDisponibilitesNestedInput
  }

  export type disponibilitesUncheckedUpdateInput = {
    id_disponibilite?: BigIntFieldUpdateOperationsInput | bigint | number
    id_jardin?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    date_dispo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    heure_debut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    heure_fin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    reservation?: reservationUncheckedUpdateManyWithoutDisponibilitesNestedInput
  }

  export type disponibilitesCreateManyInput = {
    id_disponibilite?: bigint | number
    id_jardin?: bigint | number | null
    date_dispo?: Date | string | null
    heure_debut?: Date | string | null
    heure_fin?: Date | string | null
    statut?: string | null
  }

  export type disponibilitesUpdateManyMutationInput = {
    id_disponibilite?: BigIntFieldUpdateOperationsInput | bigint | number
    date_dispo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    heure_debut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    heure_fin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type disponibilitesUncheckedUpdateManyInput = {
    id_disponibilite?: BigIntFieldUpdateOperationsInput | bigint | number
    id_jardin?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    date_dispo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    heure_debut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    heure_fin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type heurescumul_esCreateInput = {
    id_historique?: bigint | number
    heures_travaillees?: number | null
    date_maj?: Date | string | null
    utilisateur?: utilisateurCreateNestedOneWithoutHeurescumul_esInput
  }

  export type heurescumul_esUncheckedCreateInput = {
    id_historique?: bigint | number
    id_utilisateur?: bigint | number | null
    heures_travaillees?: number | null
    date_maj?: Date | string | null
  }

  export type heurescumul_esUpdateInput = {
    id_historique?: BigIntFieldUpdateOperationsInput | bigint | number
    heures_travaillees?: NullableFloatFieldUpdateOperationsInput | number | null
    date_maj?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    utilisateur?: utilisateurUpdateOneWithoutHeurescumul_esNestedInput
  }

  export type heurescumul_esUncheckedUpdateInput = {
    id_historique?: BigIntFieldUpdateOperationsInput | bigint | number
    id_utilisateur?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    heures_travaillees?: NullableFloatFieldUpdateOperationsInput | number | null
    date_maj?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type heurescumul_esCreateManyInput = {
    id_historique?: bigint | number
    id_utilisateur?: bigint | number | null
    heures_travaillees?: number | null
    date_maj?: Date | string | null
  }

  export type heurescumul_esUpdateManyMutationInput = {
    id_historique?: BigIntFieldUpdateOperationsInput | bigint | number
    heures_travaillees?: NullableFloatFieldUpdateOperationsInput | number | null
    date_maj?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type heurescumul_esUncheckedUpdateManyInput = {
    id_historique?: BigIntFieldUpdateOperationsInput | bigint | number
    id_utilisateur?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    heures_travaillees?: NullableFloatFieldUpdateOperationsInput | number | null
    date_maj?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type jardinCreateInput = {
    id_jardin?: bigint | number
    titre?: string | null
    description?: string | null
    adresse?: string | null
    superficie?: number | null
    type?: string | null
    besoins?: string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: Date | string | null
    statut?: string | null
    note_moyenne?: number | null
    avis?: avisCreateNestedManyWithoutJardinInput
    disponibilites?: disponibilitesCreateNestedManyWithoutJardinInput
    utilisateur: utilisateurCreateNestedOneWithoutJardinInput
    reservation?: reservationCreateNestedManyWithoutJardinInput
  }

  export type jardinUncheckedCreateInput = {
    id_jardin?: bigint | number
    id_proprietaire: bigint | number
    titre?: string | null
    description?: string | null
    adresse?: string | null
    superficie?: number | null
    type?: string | null
    besoins?: string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: Date | string | null
    statut?: string | null
    note_moyenne?: number | null
    avis?: avisUncheckedCreateNestedManyWithoutJardinInput
    disponibilites?: disponibilitesUncheckedCreateNestedManyWithoutJardinInput
    reservation?: reservationUncheckedCreateNestedManyWithoutJardinInput
  }

  export type jardinUpdateInput = {
    id_jardin?: BigIntFieldUpdateOperationsInput | bigint | number
    titre?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    superficie?: NullableFloatFieldUpdateOperationsInput | number | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    besoins?: NullableStringFieldUpdateOperationsInput | string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUpdateManyWithoutJardinNestedInput
    disponibilites?: disponibilitesUpdateManyWithoutJardinNestedInput
    utilisateur?: utilisateurUpdateOneRequiredWithoutJardinNestedInput
    reservation?: reservationUpdateManyWithoutJardinNestedInput
  }

  export type jardinUncheckedUpdateInput = {
    id_jardin?: BigIntFieldUpdateOperationsInput | bigint | number
    id_proprietaire?: BigIntFieldUpdateOperationsInput | bigint | number
    titre?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    superficie?: NullableFloatFieldUpdateOperationsInput | number | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    besoins?: NullableStringFieldUpdateOperationsInput | string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUncheckedUpdateManyWithoutJardinNestedInput
    disponibilites?: disponibilitesUncheckedUpdateManyWithoutJardinNestedInput
    reservation?: reservationUncheckedUpdateManyWithoutJardinNestedInput
  }

  export type jardinCreateManyInput = {
    id_jardin?: bigint | number
    id_proprietaire: bigint | number
    titre?: string | null
    description?: string | null
    adresse?: string | null
    superficie?: number | null
    type?: string | null
    besoins?: string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: Date | string | null
    statut?: string | null
    note_moyenne?: number | null
  }

  export type jardinUpdateManyMutationInput = {
    id_jardin?: BigIntFieldUpdateOperationsInput | bigint | number
    titre?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    superficie?: NullableFloatFieldUpdateOperationsInput | number | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    besoins?: NullableStringFieldUpdateOperationsInput | string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type jardinUncheckedUpdateManyInput = {
    id_jardin?: BigIntFieldUpdateOperationsInput | bigint | number
    id_proprietaire?: BigIntFieldUpdateOperationsInput | bigint | number
    titre?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    superficie?: NullableFloatFieldUpdateOperationsInput | number | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    besoins?: NullableStringFieldUpdateOperationsInput | string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type messagerieCreateInput = {
    id_message?: bigint | number
    contenu?: string | null
    date_envoi?: Date | string | null
    lu?: boolean | null
    utilisateur_messagerie_id_destinataireToutilisateur?: utilisateurCreateNestedOneWithoutMessagerie_messagerie_id_destinataireToutilisateurInput
    utilisateur_messagerie_id_envoyeurToutilisateur?: utilisateurCreateNestedOneWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput
  }

  export type messagerieUncheckedCreateInput = {
    id_message?: bigint | number
    id_envoyeur?: bigint | number | null
    id_destinataire?: bigint | number | null
    contenu?: string | null
    date_envoi?: Date | string | null
    lu?: boolean | null
  }

  export type messagerieUpdateInput = {
    id_message?: BigIntFieldUpdateOperationsInput | bigint | number
    contenu?: NullableStringFieldUpdateOperationsInput | string | null
    date_envoi?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lu?: NullableBoolFieldUpdateOperationsInput | boolean | null
    utilisateur_messagerie_id_destinataireToutilisateur?: utilisateurUpdateOneWithoutMessagerie_messagerie_id_destinataireToutilisateurNestedInput
    utilisateur_messagerie_id_envoyeurToutilisateur?: utilisateurUpdateOneWithoutMessagerie_messagerie_id_envoyeurToutilisateurNestedInput
  }

  export type messagerieUncheckedUpdateInput = {
    id_message?: BigIntFieldUpdateOperationsInput | bigint | number
    id_envoyeur?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    id_destinataire?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    contenu?: NullableStringFieldUpdateOperationsInput | string | null
    date_envoi?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lu?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type messagerieCreateManyInput = {
    id_message?: bigint | number
    id_envoyeur?: bigint | number | null
    id_destinataire?: bigint | number | null
    contenu?: string | null
    date_envoi?: Date | string | null
    lu?: boolean | null
  }

  export type messagerieUpdateManyMutationInput = {
    id_message?: BigIntFieldUpdateOperationsInput | bigint | number
    contenu?: NullableStringFieldUpdateOperationsInput | string | null
    date_envoi?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lu?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type messagerieUncheckedUpdateManyInput = {
    id_message?: BigIntFieldUpdateOperationsInput | bigint | number
    id_envoyeur?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    id_destinataire?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    contenu?: NullableStringFieldUpdateOperationsInput | string | null
    date_envoi?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lu?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type reservationCreateInput = {
    id_reservation?: bigint | number
    statut?: string | null
    date_reservation?: Date | string | null
    commentaires?: string | null
    disponibilites?: disponibilitesCreateNestedOneWithoutReservationInput
    jardin?: jardinCreateNestedOneWithoutReservationInput
    utilisateur?: utilisateurCreateNestedOneWithoutReservationInput
  }

  export type reservationUncheckedCreateInput = {
    id_reservation?: bigint | number
    id_utilisateur?: bigint | number | null
    id_jardin?: bigint | number | null
    id_disponibilite?: bigint | number | null
    statut?: string | null
    date_reservation?: Date | string | null
    commentaires?: string | null
  }

  export type reservationUpdateInput = {
    id_reservation?: BigIntFieldUpdateOperationsInput | bigint | number
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    date_reservation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commentaires?: NullableStringFieldUpdateOperationsInput | string | null
    disponibilites?: disponibilitesUpdateOneWithoutReservationNestedInput
    jardin?: jardinUpdateOneWithoutReservationNestedInput
    utilisateur?: utilisateurUpdateOneWithoutReservationNestedInput
  }

  export type reservationUncheckedUpdateInput = {
    id_reservation?: BigIntFieldUpdateOperationsInput | bigint | number
    id_utilisateur?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    id_jardin?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    id_disponibilite?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    date_reservation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commentaires?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type reservationCreateManyInput = {
    id_reservation?: bigint | number
    id_utilisateur?: bigint | number | null
    id_jardin?: bigint | number | null
    id_disponibilite?: bigint | number | null
    statut?: string | null
    date_reservation?: Date | string | null
    commentaires?: string | null
  }

  export type reservationUpdateManyMutationInput = {
    id_reservation?: BigIntFieldUpdateOperationsInput | bigint | number
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    date_reservation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commentaires?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type reservationUncheckedUpdateManyInput = {
    id_reservation?: BigIntFieldUpdateOperationsInput | bigint | number
    id_utilisateur?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    id_jardin?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    id_disponibilite?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    date_reservation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commentaires?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type utilisateurCreateInput = {
    id_utilisateur?: bigint | number
    prenom?: string | null
    nom?: string | null
    email?: string | null
    mot_de_passe?: string | null
    role?: string | null
    photo_profil?: string | null
    biographie?: string | null
    date_inscription?: Date | string | null
    telephone?: string | null
    adresse?: string | null
    note_moyenne?: number | null
    avis?: avisCreateNestedManyWithoutUtilisateurInput
    heurescumul_es?: heurescumul_esCreateNestedManyWithoutUtilisateurInput
    jardin?: jardinCreateNestedOneWithoutUtilisateurInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieCreateNestedManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieCreateNestedManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput
    reservation?: reservationCreateNestedManyWithoutUtilisateurInput
    competences?: utilisateurCompetenceCreateNestedManyWithoutUtilisateurInput
  }

  export type utilisateurUncheckedCreateInput = {
    id_utilisateur?: bigint | number
    prenom?: string | null
    nom?: string | null
    email?: string | null
    mot_de_passe?: string | null
    role?: string | null
    photo_profil?: string | null
    biographie?: string | null
    date_inscription?: Date | string | null
    telephone?: string | null
    adresse?: string | null
    note_moyenne?: number | null
    avis?: avisUncheckedCreateNestedManyWithoutUtilisateurInput
    heurescumul_es?: heurescumul_esUncheckedCreateNestedManyWithoutUtilisateurInput
    jardin?: jardinUncheckedCreateNestedOneWithoutUtilisateurInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieUncheckedCreateNestedManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieUncheckedCreateNestedManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput
    reservation?: reservationUncheckedCreateNestedManyWithoutUtilisateurInput
    competences?: utilisateurCompetenceUncheckedCreateNestedManyWithoutUtilisateurInput
  }

  export type utilisateurUpdateInput = {
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
    prenom?: NullableStringFieldUpdateOperationsInput | string | null
    nom?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mot_de_passe?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    photo_profil?: NullableStringFieldUpdateOperationsInput | string | null
    biographie?: NullableStringFieldUpdateOperationsInput | string | null
    date_inscription?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUpdateManyWithoutUtilisateurNestedInput
    heurescumul_es?: heurescumul_esUpdateManyWithoutUtilisateurNestedInput
    jardin?: jardinUpdateOneWithoutUtilisateurNestedInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieUpdateManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurNestedInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieUpdateManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurNestedInput
    reservation?: reservationUpdateManyWithoutUtilisateurNestedInput
    competences?: utilisateurCompetenceUpdateManyWithoutUtilisateurNestedInput
  }

  export type utilisateurUncheckedUpdateInput = {
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
    prenom?: NullableStringFieldUpdateOperationsInput | string | null
    nom?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mot_de_passe?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    photo_profil?: NullableStringFieldUpdateOperationsInput | string | null
    biographie?: NullableStringFieldUpdateOperationsInput | string | null
    date_inscription?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUncheckedUpdateManyWithoutUtilisateurNestedInput
    heurescumul_es?: heurescumul_esUncheckedUpdateManyWithoutUtilisateurNestedInput
    jardin?: jardinUncheckedUpdateOneWithoutUtilisateurNestedInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieUncheckedUpdateManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurNestedInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieUncheckedUpdateManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurNestedInput
    reservation?: reservationUncheckedUpdateManyWithoutUtilisateurNestedInput
    competences?: utilisateurCompetenceUncheckedUpdateManyWithoutUtilisateurNestedInput
  }

  export type utilisateurCreateManyInput = {
    id_utilisateur?: bigint | number
    prenom?: string | null
    nom?: string | null
    email?: string | null
    mot_de_passe?: string | null
    role?: string | null
    photo_profil?: string | null
    biographie?: string | null
    date_inscription?: Date | string | null
    telephone?: string | null
    adresse?: string | null
    note_moyenne?: number | null
  }

  export type utilisateurUpdateManyMutationInput = {
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
    prenom?: NullableStringFieldUpdateOperationsInput | string | null
    nom?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mot_de_passe?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    photo_profil?: NullableStringFieldUpdateOperationsInput | string | null
    biographie?: NullableStringFieldUpdateOperationsInput | string | null
    date_inscription?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type utilisateurUncheckedUpdateManyInput = {
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
    prenom?: NullableStringFieldUpdateOperationsInput | string | null
    nom?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mot_de_passe?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    photo_profil?: NullableStringFieldUpdateOperationsInput | string | null
    biographie?: NullableStringFieldUpdateOperationsInput | string | null
    date_inscription?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type competenceCreateInput = {
    nom: string
    utilisateurs?: utilisateurCompetenceCreateNestedManyWithoutCompetenceInput
  }

  export type competenceUncheckedCreateInput = {
    id_competence?: number
    nom: string
    utilisateurs?: utilisateurCompetenceUncheckedCreateNestedManyWithoutCompetenceInput
  }

  export type competenceUpdateInput = {
    nom?: StringFieldUpdateOperationsInput | string
    utilisateurs?: utilisateurCompetenceUpdateManyWithoutCompetenceNestedInput
  }

  export type competenceUncheckedUpdateInput = {
    id_competence?: IntFieldUpdateOperationsInput | number
    nom?: StringFieldUpdateOperationsInput | string
    utilisateurs?: utilisateurCompetenceUncheckedUpdateManyWithoutCompetenceNestedInput
  }

  export type competenceCreateManyInput = {
    id_competence?: number
    nom: string
  }

  export type competenceUpdateManyMutationInput = {
    nom?: StringFieldUpdateOperationsInput | string
  }

  export type competenceUncheckedUpdateManyInput = {
    id_competence?: IntFieldUpdateOperationsInput | number
    nom?: StringFieldUpdateOperationsInput | string
  }

  export type utilisateurCompetenceCreateInput = {
    utilisateur: utilisateurCreateNestedOneWithoutCompetencesInput
    competence: competenceCreateNestedOneWithoutUtilisateursInput
  }

  export type utilisateurCompetenceUncheckedCreateInput = {
    id_utilisateur_competence?: number
    id_utilisateur: bigint | number
    id_competence: number
  }

  export type utilisateurCompetenceUpdateInput = {
    utilisateur?: utilisateurUpdateOneRequiredWithoutCompetencesNestedInput
    competence?: competenceUpdateOneRequiredWithoutUtilisateursNestedInput
  }

  export type utilisateurCompetenceUncheckedUpdateInput = {
    id_utilisateur_competence?: IntFieldUpdateOperationsInput | number
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
    id_competence?: IntFieldUpdateOperationsInput | number
  }

  export type utilisateurCompetenceCreateManyInput = {
    id_utilisateur_competence?: number
    id_utilisateur: bigint | number
    id_competence: number
  }

  export type utilisateurCompetenceUpdateManyMutationInput = {

  }

  export type utilisateurCompetenceUncheckedUpdateManyInput = {
    id_utilisateur_competence?: IntFieldUpdateOperationsInput | number
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
    id_competence?: IntFieldUpdateOperationsInput | number
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type JardinNullableScalarRelationFilter = {
    is?: jardinWhereInput | null
    isNot?: jardinWhereInput | null
  }

  export type UtilisateurNullableScalarRelationFilter = {
    is?: utilisateurWhereInput | null
    isNot?: utilisateurWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type avisCountOrderByAggregateInput = {
    id_avis?: SortOrder
    id_utilisateur?: SortOrder
    id_jardin?: SortOrder
    note?: SortOrder
    commentaire?: SortOrder
    date_avis?: SortOrder
  }

  export type avisAvgOrderByAggregateInput = {
    id_avis?: SortOrder
    id_utilisateur?: SortOrder
    id_jardin?: SortOrder
    note?: SortOrder
  }

  export type avisMaxOrderByAggregateInput = {
    id_avis?: SortOrder
    id_utilisateur?: SortOrder
    id_jardin?: SortOrder
    note?: SortOrder
    commentaire?: SortOrder
    date_avis?: SortOrder
  }

  export type avisMinOrderByAggregateInput = {
    id_avis?: SortOrder
    id_utilisateur?: SortOrder
    id_jardin?: SortOrder
    note?: SortOrder
    commentaire?: SortOrder
    date_avis?: SortOrder
  }

  export type avisSumOrderByAggregateInput = {
    id_avis?: SortOrder
    id_utilisateur?: SortOrder
    id_jardin?: SortOrder
    note?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ReservationListRelationFilter = {
    every?: reservationWhereInput
    some?: reservationWhereInput
    none?: reservationWhereInput
  }

  export type reservationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type disponibilitesCountOrderByAggregateInput = {
    id_disponibilite?: SortOrder
    id_jardin?: SortOrder
    date_dispo?: SortOrder
    heure_debut?: SortOrder
    heure_fin?: SortOrder
    statut?: SortOrder
  }

  export type disponibilitesAvgOrderByAggregateInput = {
    id_disponibilite?: SortOrder
    id_jardin?: SortOrder
  }

  export type disponibilitesMaxOrderByAggregateInput = {
    id_disponibilite?: SortOrder
    id_jardin?: SortOrder
    date_dispo?: SortOrder
    heure_debut?: SortOrder
    heure_fin?: SortOrder
    statut?: SortOrder
  }

  export type disponibilitesMinOrderByAggregateInput = {
    id_disponibilite?: SortOrder
    id_jardin?: SortOrder
    date_dispo?: SortOrder
    heure_debut?: SortOrder
    heure_fin?: SortOrder
    statut?: SortOrder
  }

  export type disponibilitesSumOrderByAggregateInput = {
    id_disponibilite?: SortOrder
    id_jardin?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type heurescumul_esCountOrderByAggregateInput = {
    id_historique?: SortOrder
    id_utilisateur?: SortOrder
    heures_travaillees?: SortOrder
    date_maj?: SortOrder
  }

  export type heurescumul_esAvgOrderByAggregateInput = {
    id_historique?: SortOrder
    id_utilisateur?: SortOrder
    heures_travaillees?: SortOrder
  }

  export type heurescumul_esMaxOrderByAggregateInput = {
    id_historique?: SortOrder
    id_utilisateur?: SortOrder
    heures_travaillees?: SortOrder
    date_maj?: SortOrder
  }

  export type heurescumul_esMinOrderByAggregateInput = {
    id_historique?: SortOrder
    id_utilisateur?: SortOrder
    heures_travaillees?: SortOrder
    date_maj?: SortOrder
  }

  export type heurescumul_esSumOrderByAggregateInput = {
    id_historique?: SortOrder
    id_utilisateur?: SortOrder
    heures_travaillees?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AvisListRelationFilter = {
    every?: avisWhereInput
    some?: avisWhereInput
    none?: avisWhereInput
  }

  export type DisponibilitesListRelationFilter = {
    every?: disponibilitesWhereInput
    some?: disponibilitesWhereInput
    none?: disponibilitesWhereInput
  }

  export type UtilisateurScalarRelationFilter = {
    is?: utilisateurWhereInput
    isNot?: utilisateurWhereInput
  }

  export type avisOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type disponibilitesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type jardinCountOrderByAggregateInput = {
    id_jardin?: SortOrder
    id_proprietaire?: SortOrder
    titre?: SortOrder
    description?: SortOrder
    adresse?: SortOrder
    superficie?: SortOrder
    type?: SortOrder
    besoins?: SortOrder
    photos?: SortOrder
    date_publication?: SortOrder
    statut?: SortOrder
    note_moyenne?: SortOrder
  }

  export type jardinAvgOrderByAggregateInput = {
    id_jardin?: SortOrder
    id_proprietaire?: SortOrder
    superficie?: SortOrder
    note_moyenne?: SortOrder
  }

  export type jardinMaxOrderByAggregateInput = {
    id_jardin?: SortOrder
    id_proprietaire?: SortOrder
    titre?: SortOrder
    description?: SortOrder
    adresse?: SortOrder
    superficie?: SortOrder
    type?: SortOrder
    besoins?: SortOrder
    date_publication?: SortOrder
    statut?: SortOrder
    note_moyenne?: SortOrder
  }

  export type jardinMinOrderByAggregateInput = {
    id_jardin?: SortOrder
    id_proprietaire?: SortOrder
    titre?: SortOrder
    description?: SortOrder
    adresse?: SortOrder
    superficie?: SortOrder
    type?: SortOrder
    besoins?: SortOrder
    date_publication?: SortOrder
    statut?: SortOrder
    note_moyenne?: SortOrder
  }

  export type jardinSumOrderByAggregateInput = {
    id_jardin?: SortOrder
    id_proprietaire?: SortOrder
    superficie?: SortOrder
    note_moyenne?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type messagerieCountOrderByAggregateInput = {
    id_message?: SortOrder
    id_envoyeur?: SortOrder
    id_destinataire?: SortOrder
    contenu?: SortOrder
    date_envoi?: SortOrder
    lu?: SortOrder
  }

  export type messagerieAvgOrderByAggregateInput = {
    id_message?: SortOrder
    id_envoyeur?: SortOrder
    id_destinataire?: SortOrder
  }

  export type messagerieMaxOrderByAggregateInput = {
    id_message?: SortOrder
    id_envoyeur?: SortOrder
    id_destinataire?: SortOrder
    contenu?: SortOrder
    date_envoi?: SortOrder
    lu?: SortOrder
  }

  export type messagerieMinOrderByAggregateInput = {
    id_message?: SortOrder
    id_envoyeur?: SortOrder
    id_destinataire?: SortOrder
    contenu?: SortOrder
    date_envoi?: SortOrder
    lu?: SortOrder
  }

  export type messagerieSumOrderByAggregateInput = {
    id_message?: SortOrder
    id_envoyeur?: SortOrder
    id_destinataire?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type DisponibilitesNullableScalarRelationFilter = {
    is?: disponibilitesWhereInput | null
    isNot?: disponibilitesWhereInput | null
  }

  export type reservationCountOrderByAggregateInput = {
    id_reservation?: SortOrder
    id_utilisateur?: SortOrder
    id_jardin?: SortOrder
    id_disponibilite?: SortOrder
    statut?: SortOrder
    date_reservation?: SortOrder
    commentaires?: SortOrder
  }

  export type reservationAvgOrderByAggregateInput = {
    id_reservation?: SortOrder
    id_utilisateur?: SortOrder
    id_jardin?: SortOrder
    id_disponibilite?: SortOrder
  }

  export type reservationMaxOrderByAggregateInput = {
    id_reservation?: SortOrder
    id_utilisateur?: SortOrder
    id_jardin?: SortOrder
    id_disponibilite?: SortOrder
    statut?: SortOrder
    date_reservation?: SortOrder
    commentaires?: SortOrder
  }

  export type reservationMinOrderByAggregateInput = {
    id_reservation?: SortOrder
    id_utilisateur?: SortOrder
    id_jardin?: SortOrder
    id_disponibilite?: SortOrder
    statut?: SortOrder
    date_reservation?: SortOrder
    commentaires?: SortOrder
  }

  export type reservationSumOrderByAggregateInput = {
    id_reservation?: SortOrder
    id_utilisateur?: SortOrder
    id_jardin?: SortOrder
    id_disponibilite?: SortOrder
  }

  export type Heurescumul_esListRelationFilter = {
    every?: heurescumul_esWhereInput
    some?: heurescumul_esWhereInput
    none?: heurescumul_esWhereInput
  }

  export type MessagerieListRelationFilter = {
    every?: messagerieWhereInput
    some?: messagerieWhereInput
    none?: messagerieWhereInput
  }

  export type UtilisateurCompetenceListRelationFilter = {
    every?: utilisateurCompetenceWhereInput
    some?: utilisateurCompetenceWhereInput
    none?: utilisateurCompetenceWhereInput
  }

  export type heurescumul_esOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type messagerieOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type utilisateurCompetenceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type utilisateurCountOrderByAggregateInput = {
    id_utilisateur?: SortOrder
    prenom?: SortOrder
    nom?: SortOrder
    email?: SortOrder
    mot_de_passe?: SortOrder
    role?: SortOrder
    photo_profil?: SortOrder
    biographie?: SortOrder
    date_inscription?: SortOrder
    telephone?: SortOrder
    adresse?: SortOrder
    note_moyenne?: SortOrder
  }

  export type utilisateurAvgOrderByAggregateInput = {
    id_utilisateur?: SortOrder
    note_moyenne?: SortOrder
  }

  export type utilisateurMaxOrderByAggregateInput = {
    id_utilisateur?: SortOrder
    prenom?: SortOrder
    nom?: SortOrder
    email?: SortOrder
    mot_de_passe?: SortOrder
    role?: SortOrder
    photo_profil?: SortOrder
    biographie?: SortOrder
    date_inscription?: SortOrder
    telephone?: SortOrder
    adresse?: SortOrder
    note_moyenne?: SortOrder
  }

  export type utilisateurMinOrderByAggregateInput = {
    id_utilisateur?: SortOrder
    prenom?: SortOrder
    nom?: SortOrder
    email?: SortOrder
    mot_de_passe?: SortOrder
    role?: SortOrder
    photo_profil?: SortOrder
    biographie?: SortOrder
    date_inscription?: SortOrder
    telephone?: SortOrder
    adresse?: SortOrder
    note_moyenne?: SortOrder
  }

  export type utilisateurSumOrderByAggregateInput = {
    id_utilisateur?: SortOrder
    note_moyenne?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type competenceCountOrderByAggregateInput = {
    id_competence?: SortOrder
    nom?: SortOrder
  }

  export type competenceAvgOrderByAggregateInput = {
    id_competence?: SortOrder
  }

  export type competenceMaxOrderByAggregateInput = {
    id_competence?: SortOrder
    nom?: SortOrder
  }

  export type competenceMinOrderByAggregateInput = {
    id_competence?: SortOrder
    nom?: SortOrder
  }

  export type competenceSumOrderByAggregateInput = {
    id_competence?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type CompetenceScalarRelationFilter = {
    is?: competenceWhereInput
    isNot?: competenceWhereInput
  }

  export type utilisateurCompetenceCountOrderByAggregateInput = {
    id_utilisateur_competence?: SortOrder
    id_utilisateur?: SortOrder
    id_competence?: SortOrder
  }

  export type utilisateurCompetenceAvgOrderByAggregateInput = {
    id_utilisateur_competence?: SortOrder
    id_utilisateur?: SortOrder
    id_competence?: SortOrder
  }

  export type utilisateurCompetenceMaxOrderByAggregateInput = {
    id_utilisateur_competence?: SortOrder
    id_utilisateur?: SortOrder
    id_competence?: SortOrder
  }

  export type utilisateurCompetenceMinOrderByAggregateInput = {
    id_utilisateur_competence?: SortOrder
    id_utilisateur?: SortOrder
    id_competence?: SortOrder
  }

  export type utilisateurCompetenceSumOrderByAggregateInput = {
    id_utilisateur_competence?: SortOrder
    id_utilisateur?: SortOrder
    id_competence?: SortOrder
  }

  export type jardinCreateNestedOneWithoutAvisInput = {
    create?: XOR<jardinCreateWithoutAvisInput, jardinUncheckedCreateWithoutAvisInput>
    connectOrCreate?: jardinCreateOrConnectWithoutAvisInput
    connect?: jardinWhereUniqueInput
  }

  export type utilisateurCreateNestedOneWithoutAvisInput = {
    create?: XOR<utilisateurCreateWithoutAvisInput, utilisateurUncheckedCreateWithoutAvisInput>
    connectOrCreate?: utilisateurCreateOrConnectWithoutAvisInput
    connect?: utilisateurWhereUniqueInput
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type jardinUpdateOneWithoutAvisNestedInput = {
    create?: XOR<jardinCreateWithoutAvisInput, jardinUncheckedCreateWithoutAvisInput>
    connectOrCreate?: jardinCreateOrConnectWithoutAvisInput
    upsert?: jardinUpsertWithoutAvisInput
    disconnect?: jardinWhereInput | boolean
    delete?: jardinWhereInput | boolean
    connect?: jardinWhereUniqueInput
    update?: XOR<XOR<jardinUpdateToOneWithWhereWithoutAvisInput, jardinUpdateWithoutAvisInput>, jardinUncheckedUpdateWithoutAvisInput>
  }

  export type utilisateurUpdateOneWithoutAvisNestedInput = {
    create?: XOR<utilisateurCreateWithoutAvisInput, utilisateurUncheckedCreateWithoutAvisInput>
    connectOrCreate?: utilisateurCreateOrConnectWithoutAvisInput
    upsert?: utilisateurUpsertWithoutAvisInput
    disconnect?: utilisateurWhereInput | boolean
    delete?: utilisateurWhereInput | boolean
    connect?: utilisateurWhereUniqueInput
    update?: XOR<XOR<utilisateurUpdateToOneWithWhereWithoutAvisInput, utilisateurUpdateWithoutAvisInput>, utilisateurUncheckedUpdateWithoutAvisInput>
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type jardinCreateNestedOneWithoutDisponibilitesInput = {
    create?: XOR<jardinCreateWithoutDisponibilitesInput, jardinUncheckedCreateWithoutDisponibilitesInput>
    connectOrCreate?: jardinCreateOrConnectWithoutDisponibilitesInput
    connect?: jardinWhereUniqueInput
  }

  export type reservationCreateNestedManyWithoutDisponibilitesInput = {
    create?: XOR<reservationCreateWithoutDisponibilitesInput, reservationUncheckedCreateWithoutDisponibilitesInput> | reservationCreateWithoutDisponibilitesInput[] | reservationUncheckedCreateWithoutDisponibilitesInput[]
    connectOrCreate?: reservationCreateOrConnectWithoutDisponibilitesInput | reservationCreateOrConnectWithoutDisponibilitesInput[]
    createMany?: reservationCreateManyDisponibilitesInputEnvelope
    connect?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
  }

  export type reservationUncheckedCreateNestedManyWithoutDisponibilitesInput = {
    create?: XOR<reservationCreateWithoutDisponibilitesInput, reservationUncheckedCreateWithoutDisponibilitesInput> | reservationCreateWithoutDisponibilitesInput[] | reservationUncheckedCreateWithoutDisponibilitesInput[]
    connectOrCreate?: reservationCreateOrConnectWithoutDisponibilitesInput | reservationCreateOrConnectWithoutDisponibilitesInput[]
    createMany?: reservationCreateManyDisponibilitesInputEnvelope
    connect?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
  }

  export type jardinUpdateOneWithoutDisponibilitesNestedInput = {
    create?: XOR<jardinCreateWithoutDisponibilitesInput, jardinUncheckedCreateWithoutDisponibilitesInput>
    connectOrCreate?: jardinCreateOrConnectWithoutDisponibilitesInput
    upsert?: jardinUpsertWithoutDisponibilitesInput
    disconnect?: jardinWhereInput | boolean
    delete?: jardinWhereInput | boolean
    connect?: jardinWhereUniqueInput
    update?: XOR<XOR<jardinUpdateToOneWithWhereWithoutDisponibilitesInput, jardinUpdateWithoutDisponibilitesInput>, jardinUncheckedUpdateWithoutDisponibilitesInput>
  }

  export type reservationUpdateManyWithoutDisponibilitesNestedInput = {
    create?: XOR<reservationCreateWithoutDisponibilitesInput, reservationUncheckedCreateWithoutDisponibilitesInput> | reservationCreateWithoutDisponibilitesInput[] | reservationUncheckedCreateWithoutDisponibilitesInput[]
    connectOrCreate?: reservationCreateOrConnectWithoutDisponibilitesInput | reservationCreateOrConnectWithoutDisponibilitesInput[]
    upsert?: reservationUpsertWithWhereUniqueWithoutDisponibilitesInput | reservationUpsertWithWhereUniqueWithoutDisponibilitesInput[]
    createMany?: reservationCreateManyDisponibilitesInputEnvelope
    set?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    disconnect?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    delete?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    connect?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    update?: reservationUpdateWithWhereUniqueWithoutDisponibilitesInput | reservationUpdateWithWhereUniqueWithoutDisponibilitesInput[]
    updateMany?: reservationUpdateManyWithWhereWithoutDisponibilitesInput | reservationUpdateManyWithWhereWithoutDisponibilitesInput[]
    deleteMany?: reservationScalarWhereInput | reservationScalarWhereInput[]
  }

  export type reservationUncheckedUpdateManyWithoutDisponibilitesNestedInput = {
    create?: XOR<reservationCreateWithoutDisponibilitesInput, reservationUncheckedCreateWithoutDisponibilitesInput> | reservationCreateWithoutDisponibilitesInput[] | reservationUncheckedCreateWithoutDisponibilitesInput[]
    connectOrCreate?: reservationCreateOrConnectWithoutDisponibilitesInput | reservationCreateOrConnectWithoutDisponibilitesInput[]
    upsert?: reservationUpsertWithWhereUniqueWithoutDisponibilitesInput | reservationUpsertWithWhereUniqueWithoutDisponibilitesInput[]
    createMany?: reservationCreateManyDisponibilitesInputEnvelope
    set?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    disconnect?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    delete?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    connect?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    update?: reservationUpdateWithWhereUniqueWithoutDisponibilitesInput | reservationUpdateWithWhereUniqueWithoutDisponibilitesInput[]
    updateMany?: reservationUpdateManyWithWhereWithoutDisponibilitesInput | reservationUpdateManyWithWhereWithoutDisponibilitesInput[]
    deleteMany?: reservationScalarWhereInput | reservationScalarWhereInput[]
  }

  export type utilisateurCreateNestedOneWithoutHeurescumul_esInput = {
    create?: XOR<utilisateurCreateWithoutHeurescumul_esInput, utilisateurUncheckedCreateWithoutHeurescumul_esInput>
    connectOrCreate?: utilisateurCreateOrConnectWithoutHeurescumul_esInput
    connect?: utilisateurWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type utilisateurUpdateOneWithoutHeurescumul_esNestedInput = {
    create?: XOR<utilisateurCreateWithoutHeurescumul_esInput, utilisateurUncheckedCreateWithoutHeurescumul_esInput>
    connectOrCreate?: utilisateurCreateOrConnectWithoutHeurescumul_esInput
    upsert?: utilisateurUpsertWithoutHeurescumul_esInput
    disconnect?: utilisateurWhereInput | boolean
    delete?: utilisateurWhereInput | boolean
    connect?: utilisateurWhereUniqueInput
    update?: XOR<XOR<utilisateurUpdateToOneWithWhereWithoutHeurescumul_esInput, utilisateurUpdateWithoutHeurescumul_esInput>, utilisateurUncheckedUpdateWithoutHeurescumul_esInput>
  }

  export type avisCreateNestedManyWithoutJardinInput = {
    create?: XOR<avisCreateWithoutJardinInput, avisUncheckedCreateWithoutJardinInput> | avisCreateWithoutJardinInput[] | avisUncheckedCreateWithoutJardinInput[]
    connectOrCreate?: avisCreateOrConnectWithoutJardinInput | avisCreateOrConnectWithoutJardinInput[]
    createMany?: avisCreateManyJardinInputEnvelope
    connect?: avisWhereUniqueInput | avisWhereUniqueInput[]
  }

  export type disponibilitesCreateNestedManyWithoutJardinInput = {
    create?: XOR<disponibilitesCreateWithoutJardinInput, disponibilitesUncheckedCreateWithoutJardinInput> | disponibilitesCreateWithoutJardinInput[] | disponibilitesUncheckedCreateWithoutJardinInput[]
    connectOrCreate?: disponibilitesCreateOrConnectWithoutJardinInput | disponibilitesCreateOrConnectWithoutJardinInput[]
    createMany?: disponibilitesCreateManyJardinInputEnvelope
    connect?: disponibilitesWhereUniqueInput | disponibilitesWhereUniqueInput[]
  }

  export type utilisateurCreateNestedOneWithoutJardinInput = {
    create?: XOR<utilisateurCreateWithoutJardinInput, utilisateurUncheckedCreateWithoutJardinInput>
    connectOrCreate?: utilisateurCreateOrConnectWithoutJardinInput
    connect?: utilisateurWhereUniqueInput
  }

  export type reservationCreateNestedManyWithoutJardinInput = {
    create?: XOR<reservationCreateWithoutJardinInput, reservationUncheckedCreateWithoutJardinInput> | reservationCreateWithoutJardinInput[] | reservationUncheckedCreateWithoutJardinInput[]
    connectOrCreate?: reservationCreateOrConnectWithoutJardinInput | reservationCreateOrConnectWithoutJardinInput[]
    createMany?: reservationCreateManyJardinInputEnvelope
    connect?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
  }

  export type avisUncheckedCreateNestedManyWithoutJardinInput = {
    create?: XOR<avisCreateWithoutJardinInput, avisUncheckedCreateWithoutJardinInput> | avisCreateWithoutJardinInput[] | avisUncheckedCreateWithoutJardinInput[]
    connectOrCreate?: avisCreateOrConnectWithoutJardinInput | avisCreateOrConnectWithoutJardinInput[]
    createMany?: avisCreateManyJardinInputEnvelope
    connect?: avisWhereUniqueInput | avisWhereUniqueInput[]
  }

  export type disponibilitesUncheckedCreateNestedManyWithoutJardinInput = {
    create?: XOR<disponibilitesCreateWithoutJardinInput, disponibilitesUncheckedCreateWithoutJardinInput> | disponibilitesCreateWithoutJardinInput[] | disponibilitesUncheckedCreateWithoutJardinInput[]
    connectOrCreate?: disponibilitesCreateOrConnectWithoutJardinInput | disponibilitesCreateOrConnectWithoutJardinInput[]
    createMany?: disponibilitesCreateManyJardinInputEnvelope
    connect?: disponibilitesWhereUniqueInput | disponibilitesWhereUniqueInput[]
  }

  export type reservationUncheckedCreateNestedManyWithoutJardinInput = {
    create?: XOR<reservationCreateWithoutJardinInput, reservationUncheckedCreateWithoutJardinInput> | reservationCreateWithoutJardinInput[] | reservationUncheckedCreateWithoutJardinInput[]
    connectOrCreate?: reservationCreateOrConnectWithoutJardinInput | reservationCreateOrConnectWithoutJardinInput[]
    createMany?: reservationCreateManyJardinInputEnvelope
    connect?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
  }

  export type avisUpdateManyWithoutJardinNestedInput = {
    create?: XOR<avisCreateWithoutJardinInput, avisUncheckedCreateWithoutJardinInput> | avisCreateWithoutJardinInput[] | avisUncheckedCreateWithoutJardinInput[]
    connectOrCreate?: avisCreateOrConnectWithoutJardinInput | avisCreateOrConnectWithoutJardinInput[]
    upsert?: avisUpsertWithWhereUniqueWithoutJardinInput | avisUpsertWithWhereUniqueWithoutJardinInput[]
    createMany?: avisCreateManyJardinInputEnvelope
    set?: avisWhereUniqueInput | avisWhereUniqueInput[]
    disconnect?: avisWhereUniqueInput | avisWhereUniqueInput[]
    delete?: avisWhereUniqueInput | avisWhereUniqueInput[]
    connect?: avisWhereUniqueInput | avisWhereUniqueInput[]
    update?: avisUpdateWithWhereUniqueWithoutJardinInput | avisUpdateWithWhereUniqueWithoutJardinInput[]
    updateMany?: avisUpdateManyWithWhereWithoutJardinInput | avisUpdateManyWithWhereWithoutJardinInput[]
    deleteMany?: avisScalarWhereInput | avisScalarWhereInput[]
  }

  export type disponibilitesUpdateManyWithoutJardinNestedInput = {
    create?: XOR<disponibilitesCreateWithoutJardinInput, disponibilitesUncheckedCreateWithoutJardinInput> | disponibilitesCreateWithoutJardinInput[] | disponibilitesUncheckedCreateWithoutJardinInput[]
    connectOrCreate?: disponibilitesCreateOrConnectWithoutJardinInput | disponibilitesCreateOrConnectWithoutJardinInput[]
    upsert?: disponibilitesUpsertWithWhereUniqueWithoutJardinInput | disponibilitesUpsertWithWhereUniqueWithoutJardinInput[]
    createMany?: disponibilitesCreateManyJardinInputEnvelope
    set?: disponibilitesWhereUniqueInput | disponibilitesWhereUniqueInput[]
    disconnect?: disponibilitesWhereUniqueInput | disponibilitesWhereUniqueInput[]
    delete?: disponibilitesWhereUniqueInput | disponibilitesWhereUniqueInput[]
    connect?: disponibilitesWhereUniqueInput | disponibilitesWhereUniqueInput[]
    update?: disponibilitesUpdateWithWhereUniqueWithoutJardinInput | disponibilitesUpdateWithWhereUniqueWithoutJardinInput[]
    updateMany?: disponibilitesUpdateManyWithWhereWithoutJardinInput | disponibilitesUpdateManyWithWhereWithoutJardinInput[]
    deleteMany?: disponibilitesScalarWhereInput | disponibilitesScalarWhereInput[]
  }

  export type utilisateurUpdateOneRequiredWithoutJardinNestedInput = {
    create?: XOR<utilisateurCreateWithoutJardinInput, utilisateurUncheckedCreateWithoutJardinInput>
    connectOrCreate?: utilisateurCreateOrConnectWithoutJardinInput
    upsert?: utilisateurUpsertWithoutJardinInput
    connect?: utilisateurWhereUniqueInput
    update?: XOR<XOR<utilisateurUpdateToOneWithWhereWithoutJardinInput, utilisateurUpdateWithoutJardinInput>, utilisateurUncheckedUpdateWithoutJardinInput>
  }

  export type reservationUpdateManyWithoutJardinNestedInput = {
    create?: XOR<reservationCreateWithoutJardinInput, reservationUncheckedCreateWithoutJardinInput> | reservationCreateWithoutJardinInput[] | reservationUncheckedCreateWithoutJardinInput[]
    connectOrCreate?: reservationCreateOrConnectWithoutJardinInput | reservationCreateOrConnectWithoutJardinInput[]
    upsert?: reservationUpsertWithWhereUniqueWithoutJardinInput | reservationUpsertWithWhereUniqueWithoutJardinInput[]
    createMany?: reservationCreateManyJardinInputEnvelope
    set?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    disconnect?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    delete?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    connect?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    update?: reservationUpdateWithWhereUniqueWithoutJardinInput | reservationUpdateWithWhereUniqueWithoutJardinInput[]
    updateMany?: reservationUpdateManyWithWhereWithoutJardinInput | reservationUpdateManyWithWhereWithoutJardinInput[]
    deleteMany?: reservationScalarWhereInput | reservationScalarWhereInput[]
  }

  export type avisUncheckedUpdateManyWithoutJardinNestedInput = {
    create?: XOR<avisCreateWithoutJardinInput, avisUncheckedCreateWithoutJardinInput> | avisCreateWithoutJardinInput[] | avisUncheckedCreateWithoutJardinInput[]
    connectOrCreate?: avisCreateOrConnectWithoutJardinInput | avisCreateOrConnectWithoutJardinInput[]
    upsert?: avisUpsertWithWhereUniqueWithoutJardinInput | avisUpsertWithWhereUniqueWithoutJardinInput[]
    createMany?: avisCreateManyJardinInputEnvelope
    set?: avisWhereUniqueInput | avisWhereUniqueInput[]
    disconnect?: avisWhereUniqueInput | avisWhereUniqueInput[]
    delete?: avisWhereUniqueInput | avisWhereUniqueInput[]
    connect?: avisWhereUniqueInput | avisWhereUniqueInput[]
    update?: avisUpdateWithWhereUniqueWithoutJardinInput | avisUpdateWithWhereUniqueWithoutJardinInput[]
    updateMany?: avisUpdateManyWithWhereWithoutJardinInput | avisUpdateManyWithWhereWithoutJardinInput[]
    deleteMany?: avisScalarWhereInput | avisScalarWhereInput[]
  }

  export type disponibilitesUncheckedUpdateManyWithoutJardinNestedInput = {
    create?: XOR<disponibilitesCreateWithoutJardinInput, disponibilitesUncheckedCreateWithoutJardinInput> | disponibilitesCreateWithoutJardinInput[] | disponibilitesUncheckedCreateWithoutJardinInput[]
    connectOrCreate?: disponibilitesCreateOrConnectWithoutJardinInput | disponibilitesCreateOrConnectWithoutJardinInput[]
    upsert?: disponibilitesUpsertWithWhereUniqueWithoutJardinInput | disponibilitesUpsertWithWhereUniqueWithoutJardinInput[]
    createMany?: disponibilitesCreateManyJardinInputEnvelope
    set?: disponibilitesWhereUniqueInput | disponibilitesWhereUniqueInput[]
    disconnect?: disponibilitesWhereUniqueInput | disponibilitesWhereUniqueInput[]
    delete?: disponibilitesWhereUniqueInput | disponibilitesWhereUniqueInput[]
    connect?: disponibilitesWhereUniqueInput | disponibilitesWhereUniqueInput[]
    update?: disponibilitesUpdateWithWhereUniqueWithoutJardinInput | disponibilitesUpdateWithWhereUniqueWithoutJardinInput[]
    updateMany?: disponibilitesUpdateManyWithWhereWithoutJardinInput | disponibilitesUpdateManyWithWhereWithoutJardinInput[]
    deleteMany?: disponibilitesScalarWhereInput | disponibilitesScalarWhereInput[]
  }

  export type reservationUncheckedUpdateManyWithoutJardinNestedInput = {
    create?: XOR<reservationCreateWithoutJardinInput, reservationUncheckedCreateWithoutJardinInput> | reservationCreateWithoutJardinInput[] | reservationUncheckedCreateWithoutJardinInput[]
    connectOrCreate?: reservationCreateOrConnectWithoutJardinInput | reservationCreateOrConnectWithoutJardinInput[]
    upsert?: reservationUpsertWithWhereUniqueWithoutJardinInput | reservationUpsertWithWhereUniqueWithoutJardinInput[]
    createMany?: reservationCreateManyJardinInputEnvelope
    set?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    disconnect?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    delete?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    connect?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    update?: reservationUpdateWithWhereUniqueWithoutJardinInput | reservationUpdateWithWhereUniqueWithoutJardinInput[]
    updateMany?: reservationUpdateManyWithWhereWithoutJardinInput | reservationUpdateManyWithWhereWithoutJardinInput[]
    deleteMany?: reservationScalarWhereInput | reservationScalarWhereInput[]
  }

  export type utilisateurCreateNestedOneWithoutMessagerie_messagerie_id_destinataireToutilisateurInput = {
    create?: XOR<utilisateurCreateWithoutMessagerie_messagerie_id_destinataireToutilisateurInput, utilisateurUncheckedCreateWithoutMessagerie_messagerie_id_destinataireToutilisateurInput>
    connectOrCreate?: utilisateurCreateOrConnectWithoutMessagerie_messagerie_id_destinataireToutilisateurInput
    connect?: utilisateurWhereUniqueInput
  }

  export type utilisateurCreateNestedOneWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput = {
    create?: XOR<utilisateurCreateWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput, utilisateurUncheckedCreateWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput>
    connectOrCreate?: utilisateurCreateOrConnectWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput
    connect?: utilisateurWhereUniqueInput
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type utilisateurUpdateOneWithoutMessagerie_messagerie_id_destinataireToutilisateurNestedInput = {
    create?: XOR<utilisateurCreateWithoutMessagerie_messagerie_id_destinataireToutilisateurInput, utilisateurUncheckedCreateWithoutMessagerie_messagerie_id_destinataireToutilisateurInput>
    connectOrCreate?: utilisateurCreateOrConnectWithoutMessagerie_messagerie_id_destinataireToutilisateurInput
    upsert?: utilisateurUpsertWithoutMessagerie_messagerie_id_destinataireToutilisateurInput
    disconnect?: utilisateurWhereInput | boolean
    delete?: utilisateurWhereInput | boolean
    connect?: utilisateurWhereUniqueInput
    update?: XOR<XOR<utilisateurUpdateToOneWithWhereWithoutMessagerie_messagerie_id_destinataireToutilisateurInput, utilisateurUpdateWithoutMessagerie_messagerie_id_destinataireToutilisateurInput>, utilisateurUncheckedUpdateWithoutMessagerie_messagerie_id_destinataireToutilisateurInput>
  }

  export type utilisateurUpdateOneWithoutMessagerie_messagerie_id_envoyeurToutilisateurNestedInput = {
    create?: XOR<utilisateurCreateWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput, utilisateurUncheckedCreateWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput>
    connectOrCreate?: utilisateurCreateOrConnectWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput
    upsert?: utilisateurUpsertWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput
    disconnect?: utilisateurWhereInput | boolean
    delete?: utilisateurWhereInput | boolean
    connect?: utilisateurWhereUniqueInput
    update?: XOR<XOR<utilisateurUpdateToOneWithWhereWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput, utilisateurUpdateWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput>, utilisateurUncheckedUpdateWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput>
  }

  export type disponibilitesCreateNestedOneWithoutReservationInput = {
    create?: XOR<disponibilitesCreateWithoutReservationInput, disponibilitesUncheckedCreateWithoutReservationInput>
    connectOrCreate?: disponibilitesCreateOrConnectWithoutReservationInput
    connect?: disponibilitesWhereUniqueInput
  }

  export type jardinCreateNestedOneWithoutReservationInput = {
    create?: XOR<jardinCreateWithoutReservationInput, jardinUncheckedCreateWithoutReservationInput>
    connectOrCreate?: jardinCreateOrConnectWithoutReservationInput
    connect?: jardinWhereUniqueInput
  }

  export type utilisateurCreateNestedOneWithoutReservationInput = {
    create?: XOR<utilisateurCreateWithoutReservationInput, utilisateurUncheckedCreateWithoutReservationInput>
    connectOrCreate?: utilisateurCreateOrConnectWithoutReservationInput
    connect?: utilisateurWhereUniqueInput
  }

  export type disponibilitesUpdateOneWithoutReservationNestedInput = {
    create?: XOR<disponibilitesCreateWithoutReservationInput, disponibilitesUncheckedCreateWithoutReservationInput>
    connectOrCreate?: disponibilitesCreateOrConnectWithoutReservationInput
    upsert?: disponibilitesUpsertWithoutReservationInput
    disconnect?: disponibilitesWhereInput | boolean
    delete?: disponibilitesWhereInput | boolean
    connect?: disponibilitesWhereUniqueInput
    update?: XOR<XOR<disponibilitesUpdateToOneWithWhereWithoutReservationInput, disponibilitesUpdateWithoutReservationInput>, disponibilitesUncheckedUpdateWithoutReservationInput>
  }

  export type jardinUpdateOneWithoutReservationNestedInput = {
    create?: XOR<jardinCreateWithoutReservationInput, jardinUncheckedCreateWithoutReservationInput>
    connectOrCreate?: jardinCreateOrConnectWithoutReservationInput
    upsert?: jardinUpsertWithoutReservationInput
    disconnect?: jardinWhereInput | boolean
    delete?: jardinWhereInput | boolean
    connect?: jardinWhereUniqueInput
    update?: XOR<XOR<jardinUpdateToOneWithWhereWithoutReservationInput, jardinUpdateWithoutReservationInput>, jardinUncheckedUpdateWithoutReservationInput>
  }

  export type utilisateurUpdateOneWithoutReservationNestedInput = {
    create?: XOR<utilisateurCreateWithoutReservationInput, utilisateurUncheckedCreateWithoutReservationInput>
    connectOrCreate?: utilisateurCreateOrConnectWithoutReservationInput
    upsert?: utilisateurUpsertWithoutReservationInput
    disconnect?: utilisateurWhereInput | boolean
    delete?: utilisateurWhereInput | boolean
    connect?: utilisateurWhereUniqueInput
    update?: XOR<XOR<utilisateurUpdateToOneWithWhereWithoutReservationInput, utilisateurUpdateWithoutReservationInput>, utilisateurUncheckedUpdateWithoutReservationInput>
  }

  export type avisCreateNestedManyWithoutUtilisateurInput = {
    create?: XOR<avisCreateWithoutUtilisateurInput, avisUncheckedCreateWithoutUtilisateurInput> | avisCreateWithoutUtilisateurInput[] | avisUncheckedCreateWithoutUtilisateurInput[]
    connectOrCreate?: avisCreateOrConnectWithoutUtilisateurInput | avisCreateOrConnectWithoutUtilisateurInput[]
    createMany?: avisCreateManyUtilisateurInputEnvelope
    connect?: avisWhereUniqueInput | avisWhereUniqueInput[]
  }

  export type heurescumul_esCreateNestedManyWithoutUtilisateurInput = {
    create?: XOR<heurescumul_esCreateWithoutUtilisateurInput, heurescumul_esUncheckedCreateWithoutUtilisateurInput> | heurescumul_esCreateWithoutUtilisateurInput[] | heurescumul_esUncheckedCreateWithoutUtilisateurInput[]
    connectOrCreate?: heurescumul_esCreateOrConnectWithoutUtilisateurInput | heurescumul_esCreateOrConnectWithoutUtilisateurInput[]
    createMany?: heurescumul_esCreateManyUtilisateurInputEnvelope
    connect?: heurescumul_esWhereUniqueInput | heurescumul_esWhereUniqueInput[]
  }

  export type jardinCreateNestedOneWithoutUtilisateurInput = {
    create?: XOR<jardinCreateWithoutUtilisateurInput, jardinUncheckedCreateWithoutUtilisateurInput>
    connectOrCreate?: jardinCreateOrConnectWithoutUtilisateurInput
    connect?: jardinWhereUniqueInput
  }

  export type messagerieCreateNestedManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput = {
    create?: XOR<messagerieCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput, messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput> | messagerieCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput[] | messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput[]
    connectOrCreate?: messagerieCreateOrConnectWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput | messagerieCreateOrConnectWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput[]
    createMany?: messagerieCreateManyUtilisateur_messagerie_id_destinataireToutilisateurInputEnvelope
    connect?: messagerieWhereUniqueInput | messagerieWhereUniqueInput[]
  }

  export type messagerieCreateNestedManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput = {
    create?: XOR<messagerieCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput, messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput> | messagerieCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput[] | messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput[]
    connectOrCreate?: messagerieCreateOrConnectWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput | messagerieCreateOrConnectWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput[]
    createMany?: messagerieCreateManyUtilisateur_messagerie_id_envoyeurToutilisateurInputEnvelope
    connect?: messagerieWhereUniqueInput | messagerieWhereUniqueInput[]
  }

  export type reservationCreateNestedManyWithoutUtilisateurInput = {
    create?: XOR<reservationCreateWithoutUtilisateurInput, reservationUncheckedCreateWithoutUtilisateurInput> | reservationCreateWithoutUtilisateurInput[] | reservationUncheckedCreateWithoutUtilisateurInput[]
    connectOrCreate?: reservationCreateOrConnectWithoutUtilisateurInput | reservationCreateOrConnectWithoutUtilisateurInput[]
    createMany?: reservationCreateManyUtilisateurInputEnvelope
    connect?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
  }

  export type utilisateurCompetenceCreateNestedManyWithoutUtilisateurInput = {
    create?: XOR<utilisateurCompetenceCreateWithoutUtilisateurInput, utilisateurCompetenceUncheckedCreateWithoutUtilisateurInput> | utilisateurCompetenceCreateWithoutUtilisateurInput[] | utilisateurCompetenceUncheckedCreateWithoutUtilisateurInput[]
    connectOrCreate?: utilisateurCompetenceCreateOrConnectWithoutUtilisateurInput | utilisateurCompetenceCreateOrConnectWithoutUtilisateurInput[]
    createMany?: utilisateurCompetenceCreateManyUtilisateurInputEnvelope
    connect?: utilisateurCompetenceWhereUniqueInput | utilisateurCompetenceWhereUniqueInput[]
  }

  export type avisUncheckedCreateNestedManyWithoutUtilisateurInput = {
    create?: XOR<avisCreateWithoutUtilisateurInput, avisUncheckedCreateWithoutUtilisateurInput> | avisCreateWithoutUtilisateurInput[] | avisUncheckedCreateWithoutUtilisateurInput[]
    connectOrCreate?: avisCreateOrConnectWithoutUtilisateurInput | avisCreateOrConnectWithoutUtilisateurInput[]
    createMany?: avisCreateManyUtilisateurInputEnvelope
    connect?: avisWhereUniqueInput | avisWhereUniqueInput[]
  }

  export type heurescumul_esUncheckedCreateNestedManyWithoutUtilisateurInput = {
    create?: XOR<heurescumul_esCreateWithoutUtilisateurInput, heurescumul_esUncheckedCreateWithoutUtilisateurInput> | heurescumul_esCreateWithoutUtilisateurInput[] | heurescumul_esUncheckedCreateWithoutUtilisateurInput[]
    connectOrCreate?: heurescumul_esCreateOrConnectWithoutUtilisateurInput | heurescumul_esCreateOrConnectWithoutUtilisateurInput[]
    createMany?: heurescumul_esCreateManyUtilisateurInputEnvelope
    connect?: heurescumul_esWhereUniqueInput | heurescumul_esWhereUniqueInput[]
  }

  export type jardinUncheckedCreateNestedOneWithoutUtilisateurInput = {
    create?: XOR<jardinCreateWithoutUtilisateurInput, jardinUncheckedCreateWithoutUtilisateurInput>
    connectOrCreate?: jardinCreateOrConnectWithoutUtilisateurInput
    connect?: jardinWhereUniqueInput
  }

  export type messagerieUncheckedCreateNestedManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput = {
    create?: XOR<messagerieCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput, messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput> | messagerieCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput[] | messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput[]
    connectOrCreate?: messagerieCreateOrConnectWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput | messagerieCreateOrConnectWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput[]
    createMany?: messagerieCreateManyUtilisateur_messagerie_id_destinataireToutilisateurInputEnvelope
    connect?: messagerieWhereUniqueInput | messagerieWhereUniqueInput[]
  }

  export type messagerieUncheckedCreateNestedManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput = {
    create?: XOR<messagerieCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput, messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput> | messagerieCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput[] | messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput[]
    connectOrCreate?: messagerieCreateOrConnectWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput | messagerieCreateOrConnectWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput[]
    createMany?: messagerieCreateManyUtilisateur_messagerie_id_envoyeurToutilisateurInputEnvelope
    connect?: messagerieWhereUniqueInput | messagerieWhereUniqueInput[]
  }

  export type reservationUncheckedCreateNestedManyWithoutUtilisateurInput = {
    create?: XOR<reservationCreateWithoutUtilisateurInput, reservationUncheckedCreateWithoutUtilisateurInput> | reservationCreateWithoutUtilisateurInput[] | reservationUncheckedCreateWithoutUtilisateurInput[]
    connectOrCreate?: reservationCreateOrConnectWithoutUtilisateurInput | reservationCreateOrConnectWithoutUtilisateurInput[]
    createMany?: reservationCreateManyUtilisateurInputEnvelope
    connect?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
  }

  export type utilisateurCompetenceUncheckedCreateNestedManyWithoutUtilisateurInput = {
    create?: XOR<utilisateurCompetenceCreateWithoutUtilisateurInput, utilisateurCompetenceUncheckedCreateWithoutUtilisateurInput> | utilisateurCompetenceCreateWithoutUtilisateurInput[] | utilisateurCompetenceUncheckedCreateWithoutUtilisateurInput[]
    connectOrCreate?: utilisateurCompetenceCreateOrConnectWithoutUtilisateurInput | utilisateurCompetenceCreateOrConnectWithoutUtilisateurInput[]
    createMany?: utilisateurCompetenceCreateManyUtilisateurInputEnvelope
    connect?: utilisateurCompetenceWhereUniqueInput | utilisateurCompetenceWhereUniqueInput[]
  }

  export type avisUpdateManyWithoutUtilisateurNestedInput = {
    create?: XOR<avisCreateWithoutUtilisateurInput, avisUncheckedCreateWithoutUtilisateurInput> | avisCreateWithoutUtilisateurInput[] | avisUncheckedCreateWithoutUtilisateurInput[]
    connectOrCreate?: avisCreateOrConnectWithoutUtilisateurInput | avisCreateOrConnectWithoutUtilisateurInput[]
    upsert?: avisUpsertWithWhereUniqueWithoutUtilisateurInput | avisUpsertWithWhereUniqueWithoutUtilisateurInput[]
    createMany?: avisCreateManyUtilisateurInputEnvelope
    set?: avisWhereUniqueInput | avisWhereUniqueInput[]
    disconnect?: avisWhereUniqueInput | avisWhereUniqueInput[]
    delete?: avisWhereUniqueInput | avisWhereUniqueInput[]
    connect?: avisWhereUniqueInput | avisWhereUniqueInput[]
    update?: avisUpdateWithWhereUniqueWithoutUtilisateurInput | avisUpdateWithWhereUniqueWithoutUtilisateurInput[]
    updateMany?: avisUpdateManyWithWhereWithoutUtilisateurInput | avisUpdateManyWithWhereWithoutUtilisateurInput[]
    deleteMany?: avisScalarWhereInput | avisScalarWhereInput[]
  }

  export type heurescumul_esUpdateManyWithoutUtilisateurNestedInput = {
    create?: XOR<heurescumul_esCreateWithoutUtilisateurInput, heurescumul_esUncheckedCreateWithoutUtilisateurInput> | heurescumul_esCreateWithoutUtilisateurInput[] | heurescumul_esUncheckedCreateWithoutUtilisateurInput[]
    connectOrCreate?: heurescumul_esCreateOrConnectWithoutUtilisateurInput | heurescumul_esCreateOrConnectWithoutUtilisateurInput[]
    upsert?: heurescumul_esUpsertWithWhereUniqueWithoutUtilisateurInput | heurescumul_esUpsertWithWhereUniqueWithoutUtilisateurInput[]
    createMany?: heurescumul_esCreateManyUtilisateurInputEnvelope
    set?: heurescumul_esWhereUniqueInput | heurescumul_esWhereUniqueInput[]
    disconnect?: heurescumul_esWhereUniqueInput | heurescumul_esWhereUniqueInput[]
    delete?: heurescumul_esWhereUniqueInput | heurescumul_esWhereUniqueInput[]
    connect?: heurescumul_esWhereUniqueInput | heurescumul_esWhereUniqueInput[]
    update?: heurescumul_esUpdateWithWhereUniqueWithoutUtilisateurInput | heurescumul_esUpdateWithWhereUniqueWithoutUtilisateurInput[]
    updateMany?: heurescumul_esUpdateManyWithWhereWithoutUtilisateurInput | heurescumul_esUpdateManyWithWhereWithoutUtilisateurInput[]
    deleteMany?: heurescumul_esScalarWhereInput | heurescumul_esScalarWhereInput[]
  }

  export type jardinUpdateOneWithoutUtilisateurNestedInput = {
    create?: XOR<jardinCreateWithoutUtilisateurInput, jardinUncheckedCreateWithoutUtilisateurInput>
    connectOrCreate?: jardinCreateOrConnectWithoutUtilisateurInput
    upsert?: jardinUpsertWithoutUtilisateurInput
    disconnect?: jardinWhereInput | boolean
    delete?: jardinWhereInput | boolean
    connect?: jardinWhereUniqueInput
    update?: XOR<XOR<jardinUpdateToOneWithWhereWithoutUtilisateurInput, jardinUpdateWithoutUtilisateurInput>, jardinUncheckedUpdateWithoutUtilisateurInput>
  }

  export type messagerieUpdateManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurNestedInput = {
    create?: XOR<messagerieCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput, messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput> | messagerieCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput[] | messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput[]
    connectOrCreate?: messagerieCreateOrConnectWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput | messagerieCreateOrConnectWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput[]
    upsert?: messagerieUpsertWithWhereUniqueWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput | messagerieUpsertWithWhereUniqueWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput[]
    createMany?: messagerieCreateManyUtilisateur_messagerie_id_destinataireToutilisateurInputEnvelope
    set?: messagerieWhereUniqueInput | messagerieWhereUniqueInput[]
    disconnect?: messagerieWhereUniqueInput | messagerieWhereUniqueInput[]
    delete?: messagerieWhereUniqueInput | messagerieWhereUniqueInput[]
    connect?: messagerieWhereUniqueInput | messagerieWhereUniqueInput[]
    update?: messagerieUpdateWithWhereUniqueWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput | messagerieUpdateWithWhereUniqueWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput[]
    updateMany?: messagerieUpdateManyWithWhereWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput | messagerieUpdateManyWithWhereWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput[]
    deleteMany?: messagerieScalarWhereInput | messagerieScalarWhereInput[]
  }

  export type messagerieUpdateManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurNestedInput = {
    create?: XOR<messagerieCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput, messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput> | messagerieCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput[] | messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput[]
    connectOrCreate?: messagerieCreateOrConnectWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput | messagerieCreateOrConnectWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput[]
    upsert?: messagerieUpsertWithWhereUniqueWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput | messagerieUpsertWithWhereUniqueWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput[]
    createMany?: messagerieCreateManyUtilisateur_messagerie_id_envoyeurToutilisateurInputEnvelope
    set?: messagerieWhereUniqueInput | messagerieWhereUniqueInput[]
    disconnect?: messagerieWhereUniqueInput | messagerieWhereUniqueInput[]
    delete?: messagerieWhereUniqueInput | messagerieWhereUniqueInput[]
    connect?: messagerieWhereUniqueInput | messagerieWhereUniqueInput[]
    update?: messagerieUpdateWithWhereUniqueWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput | messagerieUpdateWithWhereUniqueWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput[]
    updateMany?: messagerieUpdateManyWithWhereWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput | messagerieUpdateManyWithWhereWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput[]
    deleteMany?: messagerieScalarWhereInput | messagerieScalarWhereInput[]
  }

  export type reservationUpdateManyWithoutUtilisateurNestedInput = {
    create?: XOR<reservationCreateWithoutUtilisateurInput, reservationUncheckedCreateWithoutUtilisateurInput> | reservationCreateWithoutUtilisateurInput[] | reservationUncheckedCreateWithoutUtilisateurInput[]
    connectOrCreate?: reservationCreateOrConnectWithoutUtilisateurInput | reservationCreateOrConnectWithoutUtilisateurInput[]
    upsert?: reservationUpsertWithWhereUniqueWithoutUtilisateurInput | reservationUpsertWithWhereUniqueWithoutUtilisateurInput[]
    createMany?: reservationCreateManyUtilisateurInputEnvelope
    set?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    disconnect?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    delete?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    connect?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    update?: reservationUpdateWithWhereUniqueWithoutUtilisateurInput | reservationUpdateWithWhereUniqueWithoutUtilisateurInput[]
    updateMany?: reservationUpdateManyWithWhereWithoutUtilisateurInput | reservationUpdateManyWithWhereWithoutUtilisateurInput[]
    deleteMany?: reservationScalarWhereInput | reservationScalarWhereInput[]
  }

  export type utilisateurCompetenceUpdateManyWithoutUtilisateurNestedInput = {
    create?: XOR<utilisateurCompetenceCreateWithoutUtilisateurInput, utilisateurCompetenceUncheckedCreateWithoutUtilisateurInput> | utilisateurCompetenceCreateWithoutUtilisateurInput[] | utilisateurCompetenceUncheckedCreateWithoutUtilisateurInput[]
    connectOrCreate?: utilisateurCompetenceCreateOrConnectWithoutUtilisateurInput | utilisateurCompetenceCreateOrConnectWithoutUtilisateurInput[]
    upsert?: utilisateurCompetenceUpsertWithWhereUniqueWithoutUtilisateurInput | utilisateurCompetenceUpsertWithWhereUniqueWithoutUtilisateurInput[]
    createMany?: utilisateurCompetenceCreateManyUtilisateurInputEnvelope
    set?: utilisateurCompetenceWhereUniqueInput | utilisateurCompetenceWhereUniqueInput[]
    disconnect?: utilisateurCompetenceWhereUniqueInput | utilisateurCompetenceWhereUniqueInput[]
    delete?: utilisateurCompetenceWhereUniqueInput | utilisateurCompetenceWhereUniqueInput[]
    connect?: utilisateurCompetenceWhereUniqueInput | utilisateurCompetenceWhereUniqueInput[]
    update?: utilisateurCompetenceUpdateWithWhereUniqueWithoutUtilisateurInput | utilisateurCompetenceUpdateWithWhereUniqueWithoutUtilisateurInput[]
    updateMany?: utilisateurCompetenceUpdateManyWithWhereWithoutUtilisateurInput | utilisateurCompetenceUpdateManyWithWhereWithoutUtilisateurInput[]
    deleteMany?: utilisateurCompetenceScalarWhereInput | utilisateurCompetenceScalarWhereInput[]
  }

  export type avisUncheckedUpdateManyWithoutUtilisateurNestedInput = {
    create?: XOR<avisCreateWithoutUtilisateurInput, avisUncheckedCreateWithoutUtilisateurInput> | avisCreateWithoutUtilisateurInput[] | avisUncheckedCreateWithoutUtilisateurInput[]
    connectOrCreate?: avisCreateOrConnectWithoutUtilisateurInput | avisCreateOrConnectWithoutUtilisateurInput[]
    upsert?: avisUpsertWithWhereUniqueWithoutUtilisateurInput | avisUpsertWithWhereUniqueWithoutUtilisateurInput[]
    createMany?: avisCreateManyUtilisateurInputEnvelope
    set?: avisWhereUniqueInput | avisWhereUniqueInput[]
    disconnect?: avisWhereUniqueInput | avisWhereUniqueInput[]
    delete?: avisWhereUniqueInput | avisWhereUniqueInput[]
    connect?: avisWhereUniqueInput | avisWhereUniqueInput[]
    update?: avisUpdateWithWhereUniqueWithoutUtilisateurInput | avisUpdateWithWhereUniqueWithoutUtilisateurInput[]
    updateMany?: avisUpdateManyWithWhereWithoutUtilisateurInput | avisUpdateManyWithWhereWithoutUtilisateurInput[]
    deleteMany?: avisScalarWhereInput | avisScalarWhereInput[]
  }

  export type heurescumul_esUncheckedUpdateManyWithoutUtilisateurNestedInput = {
    create?: XOR<heurescumul_esCreateWithoutUtilisateurInput, heurescumul_esUncheckedCreateWithoutUtilisateurInput> | heurescumul_esCreateWithoutUtilisateurInput[] | heurescumul_esUncheckedCreateWithoutUtilisateurInput[]
    connectOrCreate?: heurescumul_esCreateOrConnectWithoutUtilisateurInput | heurescumul_esCreateOrConnectWithoutUtilisateurInput[]
    upsert?: heurescumul_esUpsertWithWhereUniqueWithoutUtilisateurInput | heurescumul_esUpsertWithWhereUniqueWithoutUtilisateurInput[]
    createMany?: heurescumul_esCreateManyUtilisateurInputEnvelope
    set?: heurescumul_esWhereUniqueInput | heurescumul_esWhereUniqueInput[]
    disconnect?: heurescumul_esWhereUniqueInput | heurescumul_esWhereUniqueInput[]
    delete?: heurescumul_esWhereUniqueInput | heurescumul_esWhereUniqueInput[]
    connect?: heurescumul_esWhereUniqueInput | heurescumul_esWhereUniqueInput[]
    update?: heurescumul_esUpdateWithWhereUniqueWithoutUtilisateurInput | heurescumul_esUpdateWithWhereUniqueWithoutUtilisateurInput[]
    updateMany?: heurescumul_esUpdateManyWithWhereWithoutUtilisateurInput | heurescumul_esUpdateManyWithWhereWithoutUtilisateurInput[]
    deleteMany?: heurescumul_esScalarWhereInput | heurescumul_esScalarWhereInput[]
  }

  export type jardinUncheckedUpdateOneWithoutUtilisateurNestedInput = {
    create?: XOR<jardinCreateWithoutUtilisateurInput, jardinUncheckedCreateWithoutUtilisateurInput>
    connectOrCreate?: jardinCreateOrConnectWithoutUtilisateurInput
    upsert?: jardinUpsertWithoutUtilisateurInput
    disconnect?: jardinWhereInput | boolean
    delete?: jardinWhereInput | boolean
    connect?: jardinWhereUniqueInput
    update?: XOR<XOR<jardinUpdateToOneWithWhereWithoutUtilisateurInput, jardinUpdateWithoutUtilisateurInput>, jardinUncheckedUpdateWithoutUtilisateurInput>
  }

  export type messagerieUncheckedUpdateManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurNestedInput = {
    create?: XOR<messagerieCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput, messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput> | messagerieCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput[] | messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput[]
    connectOrCreate?: messagerieCreateOrConnectWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput | messagerieCreateOrConnectWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput[]
    upsert?: messagerieUpsertWithWhereUniqueWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput | messagerieUpsertWithWhereUniqueWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput[]
    createMany?: messagerieCreateManyUtilisateur_messagerie_id_destinataireToutilisateurInputEnvelope
    set?: messagerieWhereUniqueInput | messagerieWhereUniqueInput[]
    disconnect?: messagerieWhereUniqueInput | messagerieWhereUniqueInput[]
    delete?: messagerieWhereUniqueInput | messagerieWhereUniqueInput[]
    connect?: messagerieWhereUniqueInput | messagerieWhereUniqueInput[]
    update?: messagerieUpdateWithWhereUniqueWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput | messagerieUpdateWithWhereUniqueWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput[]
    updateMany?: messagerieUpdateManyWithWhereWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput | messagerieUpdateManyWithWhereWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput[]
    deleteMany?: messagerieScalarWhereInput | messagerieScalarWhereInput[]
  }

  export type messagerieUncheckedUpdateManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurNestedInput = {
    create?: XOR<messagerieCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput, messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput> | messagerieCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput[] | messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput[]
    connectOrCreate?: messagerieCreateOrConnectWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput | messagerieCreateOrConnectWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput[]
    upsert?: messagerieUpsertWithWhereUniqueWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput | messagerieUpsertWithWhereUniqueWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput[]
    createMany?: messagerieCreateManyUtilisateur_messagerie_id_envoyeurToutilisateurInputEnvelope
    set?: messagerieWhereUniqueInput | messagerieWhereUniqueInput[]
    disconnect?: messagerieWhereUniqueInput | messagerieWhereUniqueInput[]
    delete?: messagerieWhereUniqueInput | messagerieWhereUniqueInput[]
    connect?: messagerieWhereUniqueInput | messagerieWhereUniqueInput[]
    update?: messagerieUpdateWithWhereUniqueWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput | messagerieUpdateWithWhereUniqueWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput[]
    updateMany?: messagerieUpdateManyWithWhereWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput | messagerieUpdateManyWithWhereWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput[]
    deleteMany?: messagerieScalarWhereInput | messagerieScalarWhereInput[]
  }

  export type reservationUncheckedUpdateManyWithoutUtilisateurNestedInput = {
    create?: XOR<reservationCreateWithoutUtilisateurInput, reservationUncheckedCreateWithoutUtilisateurInput> | reservationCreateWithoutUtilisateurInput[] | reservationUncheckedCreateWithoutUtilisateurInput[]
    connectOrCreate?: reservationCreateOrConnectWithoutUtilisateurInput | reservationCreateOrConnectWithoutUtilisateurInput[]
    upsert?: reservationUpsertWithWhereUniqueWithoutUtilisateurInput | reservationUpsertWithWhereUniqueWithoutUtilisateurInput[]
    createMany?: reservationCreateManyUtilisateurInputEnvelope
    set?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    disconnect?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    delete?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    connect?: reservationWhereUniqueInput | reservationWhereUniqueInput[]
    update?: reservationUpdateWithWhereUniqueWithoutUtilisateurInput | reservationUpdateWithWhereUniqueWithoutUtilisateurInput[]
    updateMany?: reservationUpdateManyWithWhereWithoutUtilisateurInput | reservationUpdateManyWithWhereWithoutUtilisateurInput[]
    deleteMany?: reservationScalarWhereInput | reservationScalarWhereInput[]
  }

  export type utilisateurCompetenceUncheckedUpdateManyWithoutUtilisateurNestedInput = {
    create?: XOR<utilisateurCompetenceCreateWithoutUtilisateurInput, utilisateurCompetenceUncheckedCreateWithoutUtilisateurInput> | utilisateurCompetenceCreateWithoutUtilisateurInput[] | utilisateurCompetenceUncheckedCreateWithoutUtilisateurInput[]
    connectOrCreate?: utilisateurCompetenceCreateOrConnectWithoutUtilisateurInput | utilisateurCompetenceCreateOrConnectWithoutUtilisateurInput[]
    upsert?: utilisateurCompetenceUpsertWithWhereUniqueWithoutUtilisateurInput | utilisateurCompetenceUpsertWithWhereUniqueWithoutUtilisateurInput[]
    createMany?: utilisateurCompetenceCreateManyUtilisateurInputEnvelope
    set?: utilisateurCompetenceWhereUniqueInput | utilisateurCompetenceWhereUniqueInput[]
    disconnect?: utilisateurCompetenceWhereUniqueInput | utilisateurCompetenceWhereUniqueInput[]
    delete?: utilisateurCompetenceWhereUniqueInput | utilisateurCompetenceWhereUniqueInput[]
    connect?: utilisateurCompetenceWhereUniqueInput | utilisateurCompetenceWhereUniqueInput[]
    update?: utilisateurCompetenceUpdateWithWhereUniqueWithoutUtilisateurInput | utilisateurCompetenceUpdateWithWhereUniqueWithoutUtilisateurInput[]
    updateMany?: utilisateurCompetenceUpdateManyWithWhereWithoutUtilisateurInput | utilisateurCompetenceUpdateManyWithWhereWithoutUtilisateurInput[]
    deleteMany?: utilisateurCompetenceScalarWhereInput | utilisateurCompetenceScalarWhereInput[]
  }

  export type utilisateurCompetenceCreateNestedManyWithoutCompetenceInput = {
    create?: XOR<utilisateurCompetenceCreateWithoutCompetenceInput, utilisateurCompetenceUncheckedCreateWithoutCompetenceInput> | utilisateurCompetenceCreateWithoutCompetenceInput[] | utilisateurCompetenceUncheckedCreateWithoutCompetenceInput[]
    connectOrCreate?: utilisateurCompetenceCreateOrConnectWithoutCompetenceInput | utilisateurCompetenceCreateOrConnectWithoutCompetenceInput[]
    createMany?: utilisateurCompetenceCreateManyCompetenceInputEnvelope
    connect?: utilisateurCompetenceWhereUniqueInput | utilisateurCompetenceWhereUniqueInput[]
  }

  export type utilisateurCompetenceUncheckedCreateNestedManyWithoutCompetenceInput = {
    create?: XOR<utilisateurCompetenceCreateWithoutCompetenceInput, utilisateurCompetenceUncheckedCreateWithoutCompetenceInput> | utilisateurCompetenceCreateWithoutCompetenceInput[] | utilisateurCompetenceUncheckedCreateWithoutCompetenceInput[]
    connectOrCreate?: utilisateurCompetenceCreateOrConnectWithoutCompetenceInput | utilisateurCompetenceCreateOrConnectWithoutCompetenceInput[]
    createMany?: utilisateurCompetenceCreateManyCompetenceInputEnvelope
    connect?: utilisateurCompetenceWhereUniqueInput | utilisateurCompetenceWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type utilisateurCompetenceUpdateManyWithoutCompetenceNestedInput = {
    create?: XOR<utilisateurCompetenceCreateWithoutCompetenceInput, utilisateurCompetenceUncheckedCreateWithoutCompetenceInput> | utilisateurCompetenceCreateWithoutCompetenceInput[] | utilisateurCompetenceUncheckedCreateWithoutCompetenceInput[]
    connectOrCreate?: utilisateurCompetenceCreateOrConnectWithoutCompetenceInput | utilisateurCompetenceCreateOrConnectWithoutCompetenceInput[]
    upsert?: utilisateurCompetenceUpsertWithWhereUniqueWithoutCompetenceInput | utilisateurCompetenceUpsertWithWhereUniqueWithoutCompetenceInput[]
    createMany?: utilisateurCompetenceCreateManyCompetenceInputEnvelope
    set?: utilisateurCompetenceWhereUniqueInput | utilisateurCompetenceWhereUniqueInput[]
    disconnect?: utilisateurCompetenceWhereUniqueInput | utilisateurCompetenceWhereUniqueInput[]
    delete?: utilisateurCompetenceWhereUniqueInput | utilisateurCompetenceWhereUniqueInput[]
    connect?: utilisateurCompetenceWhereUniqueInput | utilisateurCompetenceWhereUniqueInput[]
    update?: utilisateurCompetenceUpdateWithWhereUniqueWithoutCompetenceInput | utilisateurCompetenceUpdateWithWhereUniqueWithoutCompetenceInput[]
    updateMany?: utilisateurCompetenceUpdateManyWithWhereWithoutCompetenceInput | utilisateurCompetenceUpdateManyWithWhereWithoutCompetenceInput[]
    deleteMany?: utilisateurCompetenceScalarWhereInput | utilisateurCompetenceScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type utilisateurCompetenceUncheckedUpdateManyWithoutCompetenceNestedInput = {
    create?: XOR<utilisateurCompetenceCreateWithoutCompetenceInput, utilisateurCompetenceUncheckedCreateWithoutCompetenceInput> | utilisateurCompetenceCreateWithoutCompetenceInput[] | utilisateurCompetenceUncheckedCreateWithoutCompetenceInput[]
    connectOrCreate?: utilisateurCompetenceCreateOrConnectWithoutCompetenceInput | utilisateurCompetenceCreateOrConnectWithoutCompetenceInput[]
    upsert?: utilisateurCompetenceUpsertWithWhereUniqueWithoutCompetenceInput | utilisateurCompetenceUpsertWithWhereUniqueWithoutCompetenceInput[]
    createMany?: utilisateurCompetenceCreateManyCompetenceInputEnvelope
    set?: utilisateurCompetenceWhereUniqueInput | utilisateurCompetenceWhereUniqueInput[]
    disconnect?: utilisateurCompetenceWhereUniqueInput | utilisateurCompetenceWhereUniqueInput[]
    delete?: utilisateurCompetenceWhereUniqueInput | utilisateurCompetenceWhereUniqueInput[]
    connect?: utilisateurCompetenceWhereUniqueInput | utilisateurCompetenceWhereUniqueInput[]
    update?: utilisateurCompetenceUpdateWithWhereUniqueWithoutCompetenceInput | utilisateurCompetenceUpdateWithWhereUniqueWithoutCompetenceInput[]
    updateMany?: utilisateurCompetenceUpdateManyWithWhereWithoutCompetenceInput | utilisateurCompetenceUpdateManyWithWhereWithoutCompetenceInput[]
    deleteMany?: utilisateurCompetenceScalarWhereInput | utilisateurCompetenceScalarWhereInput[]
  }

  export type utilisateurCreateNestedOneWithoutCompetencesInput = {
    create?: XOR<utilisateurCreateWithoutCompetencesInput, utilisateurUncheckedCreateWithoutCompetencesInput>
    connectOrCreate?: utilisateurCreateOrConnectWithoutCompetencesInput
    connect?: utilisateurWhereUniqueInput
  }

  export type competenceCreateNestedOneWithoutUtilisateursInput = {
    create?: XOR<competenceCreateWithoutUtilisateursInput, competenceUncheckedCreateWithoutUtilisateursInput>
    connectOrCreate?: competenceCreateOrConnectWithoutUtilisateursInput
    connect?: competenceWhereUniqueInput
  }

  export type utilisateurUpdateOneRequiredWithoutCompetencesNestedInput = {
    create?: XOR<utilisateurCreateWithoutCompetencesInput, utilisateurUncheckedCreateWithoutCompetencesInput>
    connectOrCreate?: utilisateurCreateOrConnectWithoutCompetencesInput
    upsert?: utilisateurUpsertWithoutCompetencesInput
    connect?: utilisateurWhereUniqueInput
    update?: XOR<XOR<utilisateurUpdateToOneWithWhereWithoutCompetencesInput, utilisateurUpdateWithoutCompetencesInput>, utilisateurUncheckedUpdateWithoutCompetencesInput>
  }

  export type competenceUpdateOneRequiredWithoutUtilisateursNestedInput = {
    create?: XOR<competenceCreateWithoutUtilisateursInput, competenceUncheckedCreateWithoutUtilisateursInput>
    connectOrCreate?: competenceCreateOrConnectWithoutUtilisateursInput
    upsert?: competenceUpsertWithoutUtilisateursInput
    connect?: competenceWhereUniqueInput
    update?: XOR<XOR<competenceUpdateToOneWithWhereWithoutUtilisateursInput, competenceUpdateWithoutUtilisateursInput>, competenceUncheckedUpdateWithoutUtilisateursInput>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type jardinCreateWithoutAvisInput = {
    id_jardin?: bigint | number
    titre?: string | null
    description?: string | null
    adresse?: string | null
    superficie?: number | null
    type?: string | null
    besoins?: string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: Date | string | null
    statut?: string | null
    note_moyenne?: number | null
    disponibilites?: disponibilitesCreateNestedManyWithoutJardinInput
    utilisateur: utilisateurCreateNestedOneWithoutJardinInput
    reservation?: reservationCreateNestedManyWithoutJardinInput
  }

  export type jardinUncheckedCreateWithoutAvisInput = {
    id_jardin?: bigint | number
    id_proprietaire: bigint | number
    titre?: string | null
    description?: string | null
    adresse?: string | null
    superficie?: number | null
    type?: string | null
    besoins?: string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: Date | string | null
    statut?: string | null
    note_moyenne?: number | null
    disponibilites?: disponibilitesUncheckedCreateNestedManyWithoutJardinInput
    reservation?: reservationUncheckedCreateNestedManyWithoutJardinInput
  }

  export type jardinCreateOrConnectWithoutAvisInput = {
    where: jardinWhereUniqueInput
    create: XOR<jardinCreateWithoutAvisInput, jardinUncheckedCreateWithoutAvisInput>
  }

  export type utilisateurCreateWithoutAvisInput = {
    id_utilisateur?: bigint | number
    prenom?: string | null
    nom?: string | null
    email?: string | null
    mot_de_passe?: string | null
    role?: string | null
    photo_profil?: string | null
    biographie?: string | null
    date_inscription?: Date | string | null
    telephone?: string | null
    adresse?: string | null
    note_moyenne?: number | null
    heurescumul_es?: heurescumul_esCreateNestedManyWithoutUtilisateurInput
    jardin?: jardinCreateNestedOneWithoutUtilisateurInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieCreateNestedManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieCreateNestedManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput
    reservation?: reservationCreateNestedManyWithoutUtilisateurInput
    competences?: utilisateurCompetenceCreateNestedManyWithoutUtilisateurInput
  }

  export type utilisateurUncheckedCreateWithoutAvisInput = {
    id_utilisateur?: bigint | number
    prenom?: string | null
    nom?: string | null
    email?: string | null
    mot_de_passe?: string | null
    role?: string | null
    photo_profil?: string | null
    biographie?: string | null
    date_inscription?: Date | string | null
    telephone?: string | null
    adresse?: string | null
    note_moyenne?: number | null
    heurescumul_es?: heurescumul_esUncheckedCreateNestedManyWithoutUtilisateurInput
    jardin?: jardinUncheckedCreateNestedOneWithoutUtilisateurInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieUncheckedCreateNestedManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieUncheckedCreateNestedManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput
    reservation?: reservationUncheckedCreateNestedManyWithoutUtilisateurInput
    competences?: utilisateurCompetenceUncheckedCreateNestedManyWithoutUtilisateurInput
  }

  export type utilisateurCreateOrConnectWithoutAvisInput = {
    where: utilisateurWhereUniqueInput
    create: XOR<utilisateurCreateWithoutAvisInput, utilisateurUncheckedCreateWithoutAvisInput>
  }

  export type jardinUpsertWithoutAvisInput = {
    update: XOR<jardinUpdateWithoutAvisInput, jardinUncheckedUpdateWithoutAvisInput>
    create: XOR<jardinCreateWithoutAvisInput, jardinUncheckedCreateWithoutAvisInput>
    where?: jardinWhereInput
  }

  export type jardinUpdateToOneWithWhereWithoutAvisInput = {
    where?: jardinWhereInput
    data: XOR<jardinUpdateWithoutAvisInput, jardinUncheckedUpdateWithoutAvisInput>
  }

  export type jardinUpdateWithoutAvisInput = {
    id_jardin?: BigIntFieldUpdateOperationsInput | bigint | number
    titre?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    superficie?: NullableFloatFieldUpdateOperationsInput | number | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    besoins?: NullableStringFieldUpdateOperationsInput | string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    disponibilites?: disponibilitesUpdateManyWithoutJardinNestedInput
    utilisateur?: utilisateurUpdateOneRequiredWithoutJardinNestedInput
    reservation?: reservationUpdateManyWithoutJardinNestedInput
  }

  export type jardinUncheckedUpdateWithoutAvisInput = {
    id_jardin?: BigIntFieldUpdateOperationsInput | bigint | number
    id_proprietaire?: BigIntFieldUpdateOperationsInput | bigint | number
    titre?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    superficie?: NullableFloatFieldUpdateOperationsInput | number | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    besoins?: NullableStringFieldUpdateOperationsInput | string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    disponibilites?: disponibilitesUncheckedUpdateManyWithoutJardinNestedInput
    reservation?: reservationUncheckedUpdateManyWithoutJardinNestedInput
  }

  export type utilisateurUpsertWithoutAvisInput = {
    update: XOR<utilisateurUpdateWithoutAvisInput, utilisateurUncheckedUpdateWithoutAvisInput>
    create: XOR<utilisateurCreateWithoutAvisInput, utilisateurUncheckedCreateWithoutAvisInput>
    where?: utilisateurWhereInput
  }

  export type utilisateurUpdateToOneWithWhereWithoutAvisInput = {
    where?: utilisateurWhereInput
    data: XOR<utilisateurUpdateWithoutAvisInput, utilisateurUncheckedUpdateWithoutAvisInput>
  }

  export type utilisateurUpdateWithoutAvisInput = {
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
    prenom?: NullableStringFieldUpdateOperationsInput | string | null
    nom?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mot_de_passe?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    photo_profil?: NullableStringFieldUpdateOperationsInput | string | null
    biographie?: NullableStringFieldUpdateOperationsInput | string | null
    date_inscription?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    heurescumul_es?: heurescumul_esUpdateManyWithoutUtilisateurNestedInput
    jardin?: jardinUpdateOneWithoutUtilisateurNestedInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieUpdateManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurNestedInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieUpdateManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurNestedInput
    reservation?: reservationUpdateManyWithoutUtilisateurNestedInput
    competences?: utilisateurCompetenceUpdateManyWithoutUtilisateurNestedInput
  }

  export type utilisateurUncheckedUpdateWithoutAvisInput = {
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
    prenom?: NullableStringFieldUpdateOperationsInput | string | null
    nom?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mot_de_passe?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    photo_profil?: NullableStringFieldUpdateOperationsInput | string | null
    biographie?: NullableStringFieldUpdateOperationsInput | string | null
    date_inscription?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    heurescumul_es?: heurescumul_esUncheckedUpdateManyWithoutUtilisateurNestedInput
    jardin?: jardinUncheckedUpdateOneWithoutUtilisateurNestedInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieUncheckedUpdateManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurNestedInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieUncheckedUpdateManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurNestedInput
    reservation?: reservationUncheckedUpdateManyWithoutUtilisateurNestedInput
    competences?: utilisateurCompetenceUncheckedUpdateManyWithoutUtilisateurNestedInput
  }

  export type jardinCreateWithoutDisponibilitesInput = {
    id_jardin?: bigint | number
    titre?: string | null
    description?: string | null
    adresse?: string | null
    superficie?: number | null
    type?: string | null
    besoins?: string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: Date | string | null
    statut?: string | null
    note_moyenne?: number | null
    avis?: avisCreateNestedManyWithoutJardinInput
    utilisateur: utilisateurCreateNestedOneWithoutJardinInput
    reservation?: reservationCreateNestedManyWithoutJardinInput
  }

  export type jardinUncheckedCreateWithoutDisponibilitesInput = {
    id_jardin?: bigint | number
    id_proprietaire: bigint | number
    titre?: string | null
    description?: string | null
    adresse?: string | null
    superficie?: number | null
    type?: string | null
    besoins?: string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: Date | string | null
    statut?: string | null
    note_moyenne?: number | null
    avis?: avisUncheckedCreateNestedManyWithoutJardinInput
    reservation?: reservationUncheckedCreateNestedManyWithoutJardinInput
  }

  export type jardinCreateOrConnectWithoutDisponibilitesInput = {
    where: jardinWhereUniqueInput
    create: XOR<jardinCreateWithoutDisponibilitesInput, jardinUncheckedCreateWithoutDisponibilitesInput>
  }

  export type reservationCreateWithoutDisponibilitesInput = {
    id_reservation?: bigint | number
    statut?: string | null
    date_reservation?: Date | string | null
    commentaires?: string | null
    jardin?: jardinCreateNestedOneWithoutReservationInput
    utilisateur?: utilisateurCreateNestedOneWithoutReservationInput
  }

  export type reservationUncheckedCreateWithoutDisponibilitesInput = {
    id_reservation?: bigint | number
    id_utilisateur?: bigint | number | null
    id_jardin?: bigint | number | null
    statut?: string | null
    date_reservation?: Date | string | null
    commentaires?: string | null
  }

  export type reservationCreateOrConnectWithoutDisponibilitesInput = {
    where: reservationWhereUniqueInput
    create: XOR<reservationCreateWithoutDisponibilitesInput, reservationUncheckedCreateWithoutDisponibilitesInput>
  }

  export type reservationCreateManyDisponibilitesInputEnvelope = {
    data: reservationCreateManyDisponibilitesInput | reservationCreateManyDisponibilitesInput[]
    skipDuplicates?: boolean
  }

  export type jardinUpsertWithoutDisponibilitesInput = {
    update: XOR<jardinUpdateWithoutDisponibilitesInput, jardinUncheckedUpdateWithoutDisponibilitesInput>
    create: XOR<jardinCreateWithoutDisponibilitesInput, jardinUncheckedCreateWithoutDisponibilitesInput>
    where?: jardinWhereInput
  }

  export type jardinUpdateToOneWithWhereWithoutDisponibilitesInput = {
    where?: jardinWhereInput
    data: XOR<jardinUpdateWithoutDisponibilitesInput, jardinUncheckedUpdateWithoutDisponibilitesInput>
  }

  export type jardinUpdateWithoutDisponibilitesInput = {
    id_jardin?: BigIntFieldUpdateOperationsInput | bigint | number
    titre?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    superficie?: NullableFloatFieldUpdateOperationsInput | number | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    besoins?: NullableStringFieldUpdateOperationsInput | string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUpdateManyWithoutJardinNestedInput
    utilisateur?: utilisateurUpdateOneRequiredWithoutJardinNestedInput
    reservation?: reservationUpdateManyWithoutJardinNestedInput
  }

  export type jardinUncheckedUpdateWithoutDisponibilitesInput = {
    id_jardin?: BigIntFieldUpdateOperationsInput | bigint | number
    id_proprietaire?: BigIntFieldUpdateOperationsInput | bigint | number
    titre?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    superficie?: NullableFloatFieldUpdateOperationsInput | number | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    besoins?: NullableStringFieldUpdateOperationsInput | string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUncheckedUpdateManyWithoutJardinNestedInput
    reservation?: reservationUncheckedUpdateManyWithoutJardinNestedInput
  }

  export type reservationUpsertWithWhereUniqueWithoutDisponibilitesInput = {
    where: reservationWhereUniqueInput
    update: XOR<reservationUpdateWithoutDisponibilitesInput, reservationUncheckedUpdateWithoutDisponibilitesInput>
    create: XOR<reservationCreateWithoutDisponibilitesInput, reservationUncheckedCreateWithoutDisponibilitesInput>
  }

  export type reservationUpdateWithWhereUniqueWithoutDisponibilitesInput = {
    where: reservationWhereUniqueInput
    data: XOR<reservationUpdateWithoutDisponibilitesInput, reservationUncheckedUpdateWithoutDisponibilitesInput>
  }

  export type reservationUpdateManyWithWhereWithoutDisponibilitesInput = {
    where: reservationScalarWhereInput
    data: XOR<reservationUpdateManyMutationInput, reservationUncheckedUpdateManyWithoutDisponibilitesInput>
  }

  export type reservationScalarWhereInput = {
    AND?: reservationScalarWhereInput | reservationScalarWhereInput[]
    OR?: reservationScalarWhereInput[]
    NOT?: reservationScalarWhereInput | reservationScalarWhereInput[]
    id_reservation?: BigIntFilter<"reservation"> | bigint | number
    id_utilisateur?: BigIntNullableFilter<"reservation"> | bigint | number | null
    id_jardin?: BigIntNullableFilter<"reservation"> | bigint | number | null
    id_disponibilite?: BigIntNullableFilter<"reservation"> | bigint | number | null
    statut?: StringNullableFilter<"reservation"> | string | null
    date_reservation?: DateTimeNullableFilter<"reservation"> | Date | string | null
    commentaires?: StringNullableFilter<"reservation"> | string | null
  }

  export type utilisateurCreateWithoutHeurescumul_esInput = {
    id_utilisateur?: bigint | number
    prenom?: string | null
    nom?: string | null
    email?: string | null
    mot_de_passe?: string | null
    role?: string | null
    photo_profil?: string | null
    biographie?: string | null
    date_inscription?: Date | string | null
    telephone?: string | null
    adresse?: string | null
    note_moyenne?: number | null
    avis?: avisCreateNestedManyWithoutUtilisateurInput
    jardin?: jardinCreateNestedOneWithoutUtilisateurInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieCreateNestedManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieCreateNestedManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput
    reservation?: reservationCreateNestedManyWithoutUtilisateurInput
    competences?: utilisateurCompetenceCreateNestedManyWithoutUtilisateurInput
  }

  export type utilisateurUncheckedCreateWithoutHeurescumul_esInput = {
    id_utilisateur?: bigint | number
    prenom?: string | null
    nom?: string | null
    email?: string | null
    mot_de_passe?: string | null
    role?: string | null
    photo_profil?: string | null
    biographie?: string | null
    date_inscription?: Date | string | null
    telephone?: string | null
    adresse?: string | null
    note_moyenne?: number | null
    avis?: avisUncheckedCreateNestedManyWithoutUtilisateurInput
    jardin?: jardinUncheckedCreateNestedOneWithoutUtilisateurInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieUncheckedCreateNestedManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieUncheckedCreateNestedManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput
    reservation?: reservationUncheckedCreateNestedManyWithoutUtilisateurInput
    competences?: utilisateurCompetenceUncheckedCreateNestedManyWithoutUtilisateurInput
  }

  export type utilisateurCreateOrConnectWithoutHeurescumul_esInput = {
    where: utilisateurWhereUniqueInput
    create: XOR<utilisateurCreateWithoutHeurescumul_esInput, utilisateurUncheckedCreateWithoutHeurescumul_esInput>
  }

  export type utilisateurUpsertWithoutHeurescumul_esInput = {
    update: XOR<utilisateurUpdateWithoutHeurescumul_esInput, utilisateurUncheckedUpdateWithoutHeurescumul_esInput>
    create: XOR<utilisateurCreateWithoutHeurescumul_esInput, utilisateurUncheckedCreateWithoutHeurescumul_esInput>
    where?: utilisateurWhereInput
  }

  export type utilisateurUpdateToOneWithWhereWithoutHeurescumul_esInput = {
    where?: utilisateurWhereInput
    data: XOR<utilisateurUpdateWithoutHeurescumul_esInput, utilisateurUncheckedUpdateWithoutHeurescumul_esInput>
  }

  export type utilisateurUpdateWithoutHeurescumul_esInput = {
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
    prenom?: NullableStringFieldUpdateOperationsInput | string | null
    nom?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mot_de_passe?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    photo_profil?: NullableStringFieldUpdateOperationsInput | string | null
    biographie?: NullableStringFieldUpdateOperationsInput | string | null
    date_inscription?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUpdateManyWithoutUtilisateurNestedInput
    jardin?: jardinUpdateOneWithoutUtilisateurNestedInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieUpdateManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurNestedInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieUpdateManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurNestedInput
    reservation?: reservationUpdateManyWithoutUtilisateurNestedInput
    competences?: utilisateurCompetenceUpdateManyWithoutUtilisateurNestedInput
  }

  export type utilisateurUncheckedUpdateWithoutHeurescumul_esInput = {
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
    prenom?: NullableStringFieldUpdateOperationsInput | string | null
    nom?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mot_de_passe?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    photo_profil?: NullableStringFieldUpdateOperationsInput | string | null
    biographie?: NullableStringFieldUpdateOperationsInput | string | null
    date_inscription?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUncheckedUpdateManyWithoutUtilisateurNestedInput
    jardin?: jardinUncheckedUpdateOneWithoutUtilisateurNestedInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieUncheckedUpdateManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurNestedInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieUncheckedUpdateManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurNestedInput
    reservation?: reservationUncheckedUpdateManyWithoutUtilisateurNestedInput
    competences?: utilisateurCompetenceUncheckedUpdateManyWithoutUtilisateurNestedInput
  }

  export type avisCreateWithoutJardinInput = {
    id_avis?: bigint | number
    note?: number | null
    commentaire?: string | null
    date_avis?: Date | string | null
    utilisateur?: utilisateurCreateNestedOneWithoutAvisInput
  }

  export type avisUncheckedCreateWithoutJardinInput = {
    id_avis?: bigint | number
    id_utilisateur?: bigint | number | null
    note?: number | null
    commentaire?: string | null
    date_avis?: Date | string | null
  }

  export type avisCreateOrConnectWithoutJardinInput = {
    where: avisWhereUniqueInput
    create: XOR<avisCreateWithoutJardinInput, avisUncheckedCreateWithoutJardinInput>
  }

  export type avisCreateManyJardinInputEnvelope = {
    data: avisCreateManyJardinInput | avisCreateManyJardinInput[]
    skipDuplicates?: boolean
  }

  export type disponibilitesCreateWithoutJardinInput = {
    id_disponibilite?: bigint | number
    date_dispo?: Date | string | null
    heure_debut?: Date | string | null
    heure_fin?: Date | string | null
    statut?: string | null
    reservation?: reservationCreateNestedManyWithoutDisponibilitesInput
  }

  export type disponibilitesUncheckedCreateWithoutJardinInput = {
    id_disponibilite?: bigint | number
    date_dispo?: Date | string | null
    heure_debut?: Date | string | null
    heure_fin?: Date | string | null
    statut?: string | null
    reservation?: reservationUncheckedCreateNestedManyWithoutDisponibilitesInput
  }

  export type disponibilitesCreateOrConnectWithoutJardinInput = {
    where: disponibilitesWhereUniqueInput
    create: XOR<disponibilitesCreateWithoutJardinInput, disponibilitesUncheckedCreateWithoutJardinInput>
  }

  export type disponibilitesCreateManyJardinInputEnvelope = {
    data: disponibilitesCreateManyJardinInput | disponibilitesCreateManyJardinInput[]
    skipDuplicates?: boolean
  }

  export type utilisateurCreateWithoutJardinInput = {
    id_utilisateur?: bigint | number
    prenom?: string | null
    nom?: string | null
    email?: string | null
    mot_de_passe?: string | null
    role?: string | null
    photo_profil?: string | null
    biographie?: string | null
    date_inscription?: Date | string | null
    telephone?: string | null
    adresse?: string | null
    note_moyenne?: number | null
    avis?: avisCreateNestedManyWithoutUtilisateurInput
    heurescumul_es?: heurescumul_esCreateNestedManyWithoutUtilisateurInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieCreateNestedManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieCreateNestedManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput
    reservation?: reservationCreateNestedManyWithoutUtilisateurInput
    competences?: utilisateurCompetenceCreateNestedManyWithoutUtilisateurInput
  }

  export type utilisateurUncheckedCreateWithoutJardinInput = {
    id_utilisateur?: bigint | number
    prenom?: string | null
    nom?: string | null
    email?: string | null
    mot_de_passe?: string | null
    role?: string | null
    photo_profil?: string | null
    biographie?: string | null
    date_inscription?: Date | string | null
    telephone?: string | null
    adresse?: string | null
    note_moyenne?: number | null
    avis?: avisUncheckedCreateNestedManyWithoutUtilisateurInput
    heurescumul_es?: heurescumul_esUncheckedCreateNestedManyWithoutUtilisateurInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieUncheckedCreateNestedManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieUncheckedCreateNestedManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput
    reservation?: reservationUncheckedCreateNestedManyWithoutUtilisateurInput
    competences?: utilisateurCompetenceUncheckedCreateNestedManyWithoutUtilisateurInput
  }

  export type utilisateurCreateOrConnectWithoutJardinInput = {
    where: utilisateurWhereUniqueInput
    create: XOR<utilisateurCreateWithoutJardinInput, utilisateurUncheckedCreateWithoutJardinInput>
  }

  export type reservationCreateWithoutJardinInput = {
    id_reservation?: bigint | number
    statut?: string | null
    date_reservation?: Date | string | null
    commentaires?: string | null
    disponibilites?: disponibilitesCreateNestedOneWithoutReservationInput
    utilisateur?: utilisateurCreateNestedOneWithoutReservationInput
  }

  export type reservationUncheckedCreateWithoutJardinInput = {
    id_reservation?: bigint | number
    id_utilisateur?: bigint | number | null
    id_disponibilite?: bigint | number | null
    statut?: string | null
    date_reservation?: Date | string | null
    commentaires?: string | null
  }

  export type reservationCreateOrConnectWithoutJardinInput = {
    where: reservationWhereUniqueInput
    create: XOR<reservationCreateWithoutJardinInput, reservationUncheckedCreateWithoutJardinInput>
  }

  export type reservationCreateManyJardinInputEnvelope = {
    data: reservationCreateManyJardinInput | reservationCreateManyJardinInput[]
    skipDuplicates?: boolean
  }

  export type avisUpsertWithWhereUniqueWithoutJardinInput = {
    where: avisWhereUniqueInput
    update: XOR<avisUpdateWithoutJardinInput, avisUncheckedUpdateWithoutJardinInput>
    create: XOR<avisCreateWithoutJardinInput, avisUncheckedCreateWithoutJardinInput>
  }

  export type avisUpdateWithWhereUniqueWithoutJardinInput = {
    where: avisWhereUniqueInput
    data: XOR<avisUpdateWithoutJardinInput, avisUncheckedUpdateWithoutJardinInput>
  }

  export type avisUpdateManyWithWhereWithoutJardinInput = {
    where: avisScalarWhereInput
    data: XOR<avisUpdateManyMutationInput, avisUncheckedUpdateManyWithoutJardinInput>
  }

  export type avisScalarWhereInput = {
    AND?: avisScalarWhereInput | avisScalarWhereInput[]
    OR?: avisScalarWhereInput[]
    NOT?: avisScalarWhereInput | avisScalarWhereInput[]
    id_avis?: BigIntFilter<"avis"> | bigint | number
    id_utilisateur?: BigIntNullableFilter<"avis"> | bigint | number | null
    id_jardin?: BigIntNullableFilter<"avis"> | bigint | number | null
    note?: IntNullableFilter<"avis"> | number | null
    commentaire?: StringNullableFilter<"avis"> | string | null
    date_avis?: DateTimeNullableFilter<"avis"> | Date | string | null
  }

  export type disponibilitesUpsertWithWhereUniqueWithoutJardinInput = {
    where: disponibilitesWhereUniqueInput
    update: XOR<disponibilitesUpdateWithoutJardinInput, disponibilitesUncheckedUpdateWithoutJardinInput>
    create: XOR<disponibilitesCreateWithoutJardinInput, disponibilitesUncheckedCreateWithoutJardinInput>
  }

  export type disponibilitesUpdateWithWhereUniqueWithoutJardinInput = {
    where: disponibilitesWhereUniqueInput
    data: XOR<disponibilitesUpdateWithoutJardinInput, disponibilitesUncheckedUpdateWithoutJardinInput>
  }

  export type disponibilitesUpdateManyWithWhereWithoutJardinInput = {
    where: disponibilitesScalarWhereInput
    data: XOR<disponibilitesUpdateManyMutationInput, disponibilitesUncheckedUpdateManyWithoutJardinInput>
  }

  export type disponibilitesScalarWhereInput = {
    AND?: disponibilitesScalarWhereInput | disponibilitesScalarWhereInput[]
    OR?: disponibilitesScalarWhereInput[]
    NOT?: disponibilitesScalarWhereInput | disponibilitesScalarWhereInput[]
    id_disponibilite?: BigIntFilter<"disponibilites"> | bigint | number
    id_jardin?: BigIntNullableFilter<"disponibilites"> | bigint | number | null
    date_dispo?: DateTimeNullableFilter<"disponibilites"> | Date | string | null
    heure_debut?: DateTimeNullableFilter<"disponibilites"> | Date | string | null
    heure_fin?: DateTimeNullableFilter<"disponibilites"> | Date | string | null
    statut?: StringNullableFilter<"disponibilites"> | string | null
  }

  export type utilisateurUpsertWithoutJardinInput = {
    update: XOR<utilisateurUpdateWithoutJardinInput, utilisateurUncheckedUpdateWithoutJardinInput>
    create: XOR<utilisateurCreateWithoutJardinInput, utilisateurUncheckedCreateWithoutJardinInput>
    where?: utilisateurWhereInput
  }

  export type utilisateurUpdateToOneWithWhereWithoutJardinInput = {
    where?: utilisateurWhereInput
    data: XOR<utilisateurUpdateWithoutJardinInput, utilisateurUncheckedUpdateWithoutJardinInput>
  }

  export type utilisateurUpdateWithoutJardinInput = {
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
    prenom?: NullableStringFieldUpdateOperationsInput | string | null
    nom?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mot_de_passe?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    photo_profil?: NullableStringFieldUpdateOperationsInput | string | null
    biographie?: NullableStringFieldUpdateOperationsInput | string | null
    date_inscription?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUpdateManyWithoutUtilisateurNestedInput
    heurescumul_es?: heurescumul_esUpdateManyWithoutUtilisateurNestedInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieUpdateManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurNestedInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieUpdateManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurNestedInput
    reservation?: reservationUpdateManyWithoutUtilisateurNestedInput
    competences?: utilisateurCompetenceUpdateManyWithoutUtilisateurNestedInput
  }

  export type utilisateurUncheckedUpdateWithoutJardinInput = {
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
    prenom?: NullableStringFieldUpdateOperationsInput | string | null
    nom?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mot_de_passe?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    photo_profil?: NullableStringFieldUpdateOperationsInput | string | null
    biographie?: NullableStringFieldUpdateOperationsInput | string | null
    date_inscription?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUncheckedUpdateManyWithoutUtilisateurNestedInput
    heurescumul_es?: heurescumul_esUncheckedUpdateManyWithoutUtilisateurNestedInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieUncheckedUpdateManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurNestedInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieUncheckedUpdateManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurNestedInput
    reservation?: reservationUncheckedUpdateManyWithoutUtilisateurNestedInput
    competences?: utilisateurCompetenceUncheckedUpdateManyWithoutUtilisateurNestedInput
  }

  export type reservationUpsertWithWhereUniqueWithoutJardinInput = {
    where: reservationWhereUniqueInput
    update: XOR<reservationUpdateWithoutJardinInput, reservationUncheckedUpdateWithoutJardinInput>
    create: XOR<reservationCreateWithoutJardinInput, reservationUncheckedCreateWithoutJardinInput>
  }

  export type reservationUpdateWithWhereUniqueWithoutJardinInput = {
    where: reservationWhereUniqueInput
    data: XOR<reservationUpdateWithoutJardinInput, reservationUncheckedUpdateWithoutJardinInput>
  }

  export type reservationUpdateManyWithWhereWithoutJardinInput = {
    where: reservationScalarWhereInput
    data: XOR<reservationUpdateManyMutationInput, reservationUncheckedUpdateManyWithoutJardinInput>
  }

  export type utilisateurCreateWithoutMessagerie_messagerie_id_destinataireToutilisateurInput = {
    id_utilisateur?: bigint | number
    prenom?: string | null
    nom?: string | null
    email?: string | null
    mot_de_passe?: string | null
    role?: string | null
    photo_profil?: string | null
    biographie?: string | null
    date_inscription?: Date | string | null
    telephone?: string | null
    adresse?: string | null
    note_moyenne?: number | null
    avis?: avisCreateNestedManyWithoutUtilisateurInput
    heurescumul_es?: heurescumul_esCreateNestedManyWithoutUtilisateurInput
    jardin?: jardinCreateNestedOneWithoutUtilisateurInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieCreateNestedManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput
    reservation?: reservationCreateNestedManyWithoutUtilisateurInput
    competences?: utilisateurCompetenceCreateNestedManyWithoutUtilisateurInput
  }

  export type utilisateurUncheckedCreateWithoutMessagerie_messagerie_id_destinataireToutilisateurInput = {
    id_utilisateur?: bigint | number
    prenom?: string | null
    nom?: string | null
    email?: string | null
    mot_de_passe?: string | null
    role?: string | null
    photo_profil?: string | null
    biographie?: string | null
    date_inscription?: Date | string | null
    telephone?: string | null
    adresse?: string | null
    note_moyenne?: number | null
    avis?: avisUncheckedCreateNestedManyWithoutUtilisateurInput
    heurescumul_es?: heurescumul_esUncheckedCreateNestedManyWithoutUtilisateurInput
    jardin?: jardinUncheckedCreateNestedOneWithoutUtilisateurInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieUncheckedCreateNestedManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput
    reservation?: reservationUncheckedCreateNestedManyWithoutUtilisateurInput
    competences?: utilisateurCompetenceUncheckedCreateNestedManyWithoutUtilisateurInput
  }

  export type utilisateurCreateOrConnectWithoutMessagerie_messagerie_id_destinataireToutilisateurInput = {
    where: utilisateurWhereUniqueInput
    create: XOR<utilisateurCreateWithoutMessagerie_messagerie_id_destinataireToutilisateurInput, utilisateurUncheckedCreateWithoutMessagerie_messagerie_id_destinataireToutilisateurInput>
  }

  export type utilisateurCreateWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput = {
    id_utilisateur?: bigint | number
    prenom?: string | null
    nom?: string | null
    email?: string | null
    mot_de_passe?: string | null
    role?: string | null
    photo_profil?: string | null
    biographie?: string | null
    date_inscription?: Date | string | null
    telephone?: string | null
    adresse?: string | null
    note_moyenne?: number | null
    avis?: avisCreateNestedManyWithoutUtilisateurInput
    heurescumul_es?: heurescumul_esCreateNestedManyWithoutUtilisateurInput
    jardin?: jardinCreateNestedOneWithoutUtilisateurInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieCreateNestedManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput
    reservation?: reservationCreateNestedManyWithoutUtilisateurInput
    competences?: utilisateurCompetenceCreateNestedManyWithoutUtilisateurInput
  }

  export type utilisateurUncheckedCreateWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput = {
    id_utilisateur?: bigint | number
    prenom?: string | null
    nom?: string | null
    email?: string | null
    mot_de_passe?: string | null
    role?: string | null
    photo_profil?: string | null
    biographie?: string | null
    date_inscription?: Date | string | null
    telephone?: string | null
    adresse?: string | null
    note_moyenne?: number | null
    avis?: avisUncheckedCreateNestedManyWithoutUtilisateurInput
    heurescumul_es?: heurescumul_esUncheckedCreateNestedManyWithoutUtilisateurInput
    jardin?: jardinUncheckedCreateNestedOneWithoutUtilisateurInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieUncheckedCreateNestedManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput
    reservation?: reservationUncheckedCreateNestedManyWithoutUtilisateurInput
    competences?: utilisateurCompetenceUncheckedCreateNestedManyWithoutUtilisateurInput
  }

  export type utilisateurCreateOrConnectWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput = {
    where: utilisateurWhereUniqueInput
    create: XOR<utilisateurCreateWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput, utilisateurUncheckedCreateWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput>
  }

  export type utilisateurUpsertWithoutMessagerie_messagerie_id_destinataireToutilisateurInput = {
    update: XOR<utilisateurUpdateWithoutMessagerie_messagerie_id_destinataireToutilisateurInput, utilisateurUncheckedUpdateWithoutMessagerie_messagerie_id_destinataireToutilisateurInput>
    create: XOR<utilisateurCreateWithoutMessagerie_messagerie_id_destinataireToutilisateurInput, utilisateurUncheckedCreateWithoutMessagerie_messagerie_id_destinataireToutilisateurInput>
    where?: utilisateurWhereInput
  }

  export type utilisateurUpdateToOneWithWhereWithoutMessagerie_messagerie_id_destinataireToutilisateurInput = {
    where?: utilisateurWhereInput
    data: XOR<utilisateurUpdateWithoutMessagerie_messagerie_id_destinataireToutilisateurInput, utilisateurUncheckedUpdateWithoutMessagerie_messagerie_id_destinataireToutilisateurInput>
  }

  export type utilisateurUpdateWithoutMessagerie_messagerie_id_destinataireToutilisateurInput = {
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
    prenom?: NullableStringFieldUpdateOperationsInput | string | null
    nom?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mot_de_passe?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    photo_profil?: NullableStringFieldUpdateOperationsInput | string | null
    biographie?: NullableStringFieldUpdateOperationsInput | string | null
    date_inscription?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUpdateManyWithoutUtilisateurNestedInput
    heurescumul_es?: heurescumul_esUpdateManyWithoutUtilisateurNestedInput
    jardin?: jardinUpdateOneWithoutUtilisateurNestedInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieUpdateManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurNestedInput
    reservation?: reservationUpdateManyWithoutUtilisateurNestedInput
    competences?: utilisateurCompetenceUpdateManyWithoutUtilisateurNestedInput
  }

  export type utilisateurUncheckedUpdateWithoutMessagerie_messagerie_id_destinataireToutilisateurInput = {
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
    prenom?: NullableStringFieldUpdateOperationsInput | string | null
    nom?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mot_de_passe?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    photo_profil?: NullableStringFieldUpdateOperationsInput | string | null
    biographie?: NullableStringFieldUpdateOperationsInput | string | null
    date_inscription?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUncheckedUpdateManyWithoutUtilisateurNestedInput
    heurescumul_es?: heurescumul_esUncheckedUpdateManyWithoutUtilisateurNestedInput
    jardin?: jardinUncheckedUpdateOneWithoutUtilisateurNestedInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieUncheckedUpdateManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurNestedInput
    reservation?: reservationUncheckedUpdateManyWithoutUtilisateurNestedInput
    competences?: utilisateurCompetenceUncheckedUpdateManyWithoutUtilisateurNestedInput
  }

  export type utilisateurUpsertWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput = {
    update: XOR<utilisateurUpdateWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput, utilisateurUncheckedUpdateWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput>
    create: XOR<utilisateurCreateWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput, utilisateurUncheckedCreateWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput>
    where?: utilisateurWhereInput
  }

  export type utilisateurUpdateToOneWithWhereWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput = {
    where?: utilisateurWhereInput
    data: XOR<utilisateurUpdateWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput, utilisateurUncheckedUpdateWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput>
  }

  export type utilisateurUpdateWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput = {
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
    prenom?: NullableStringFieldUpdateOperationsInput | string | null
    nom?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mot_de_passe?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    photo_profil?: NullableStringFieldUpdateOperationsInput | string | null
    biographie?: NullableStringFieldUpdateOperationsInput | string | null
    date_inscription?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUpdateManyWithoutUtilisateurNestedInput
    heurescumul_es?: heurescumul_esUpdateManyWithoutUtilisateurNestedInput
    jardin?: jardinUpdateOneWithoutUtilisateurNestedInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieUpdateManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurNestedInput
    reservation?: reservationUpdateManyWithoutUtilisateurNestedInput
    competences?: utilisateurCompetenceUpdateManyWithoutUtilisateurNestedInput
  }

  export type utilisateurUncheckedUpdateWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput = {
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
    prenom?: NullableStringFieldUpdateOperationsInput | string | null
    nom?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mot_de_passe?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    photo_profil?: NullableStringFieldUpdateOperationsInput | string | null
    biographie?: NullableStringFieldUpdateOperationsInput | string | null
    date_inscription?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUncheckedUpdateManyWithoutUtilisateurNestedInput
    heurescumul_es?: heurescumul_esUncheckedUpdateManyWithoutUtilisateurNestedInput
    jardin?: jardinUncheckedUpdateOneWithoutUtilisateurNestedInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieUncheckedUpdateManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurNestedInput
    reservation?: reservationUncheckedUpdateManyWithoutUtilisateurNestedInput
    competences?: utilisateurCompetenceUncheckedUpdateManyWithoutUtilisateurNestedInput
  }

  export type disponibilitesCreateWithoutReservationInput = {
    id_disponibilite?: bigint | number
    date_dispo?: Date | string | null
    heure_debut?: Date | string | null
    heure_fin?: Date | string | null
    statut?: string | null
    jardin?: jardinCreateNestedOneWithoutDisponibilitesInput
  }

  export type disponibilitesUncheckedCreateWithoutReservationInput = {
    id_disponibilite?: bigint | number
    id_jardin?: bigint | number | null
    date_dispo?: Date | string | null
    heure_debut?: Date | string | null
    heure_fin?: Date | string | null
    statut?: string | null
  }

  export type disponibilitesCreateOrConnectWithoutReservationInput = {
    where: disponibilitesWhereUniqueInput
    create: XOR<disponibilitesCreateWithoutReservationInput, disponibilitesUncheckedCreateWithoutReservationInput>
  }

  export type jardinCreateWithoutReservationInput = {
    id_jardin?: bigint | number
    titre?: string | null
    description?: string | null
    adresse?: string | null
    superficie?: number | null
    type?: string | null
    besoins?: string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: Date | string | null
    statut?: string | null
    note_moyenne?: number | null
    avis?: avisCreateNestedManyWithoutJardinInput
    disponibilites?: disponibilitesCreateNestedManyWithoutJardinInput
    utilisateur: utilisateurCreateNestedOneWithoutJardinInput
  }

  export type jardinUncheckedCreateWithoutReservationInput = {
    id_jardin?: bigint | number
    id_proprietaire: bigint | number
    titre?: string | null
    description?: string | null
    adresse?: string | null
    superficie?: number | null
    type?: string | null
    besoins?: string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: Date | string | null
    statut?: string | null
    note_moyenne?: number | null
    avis?: avisUncheckedCreateNestedManyWithoutJardinInput
    disponibilites?: disponibilitesUncheckedCreateNestedManyWithoutJardinInput
  }

  export type jardinCreateOrConnectWithoutReservationInput = {
    where: jardinWhereUniqueInput
    create: XOR<jardinCreateWithoutReservationInput, jardinUncheckedCreateWithoutReservationInput>
  }

  export type utilisateurCreateWithoutReservationInput = {
    id_utilisateur?: bigint | number
    prenom?: string | null
    nom?: string | null
    email?: string | null
    mot_de_passe?: string | null
    role?: string | null
    photo_profil?: string | null
    biographie?: string | null
    date_inscription?: Date | string | null
    telephone?: string | null
    adresse?: string | null
    note_moyenne?: number | null
    avis?: avisCreateNestedManyWithoutUtilisateurInput
    heurescumul_es?: heurescumul_esCreateNestedManyWithoutUtilisateurInput
    jardin?: jardinCreateNestedOneWithoutUtilisateurInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieCreateNestedManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieCreateNestedManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput
    competences?: utilisateurCompetenceCreateNestedManyWithoutUtilisateurInput
  }

  export type utilisateurUncheckedCreateWithoutReservationInput = {
    id_utilisateur?: bigint | number
    prenom?: string | null
    nom?: string | null
    email?: string | null
    mot_de_passe?: string | null
    role?: string | null
    photo_profil?: string | null
    biographie?: string | null
    date_inscription?: Date | string | null
    telephone?: string | null
    adresse?: string | null
    note_moyenne?: number | null
    avis?: avisUncheckedCreateNestedManyWithoutUtilisateurInput
    heurescumul_es?: heurescumul_esUncheckedCreateNestedManyWithoutUtilisateurInput
    jardin?: jardinUncheckedCreateNestedOneWithoutUtilisateurInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieUncheckedCreateNestedManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieUncheckedCreateNestedManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput
    competences?: utilisateurCompetenceUncheckedCreateNestedManyWithoutUtilisateurInput
  }

  export type utilisateurCreateOrConnectWithoutReservationInput = {
    where: utilisateurWhereUniqueInput
    create: XOR<utilisateurCreateWithoutReservationInput, utilisateurUncheckedCreateWithoutReservationInput>
  }

  export type disponibilitesUpsertWithoutReservationInput = {
    update: XOR<disponibilitesUpdateWithoutReservationInput, disponibilitesUncheckedUpdateWithoutReservationInput>
    create: XOR<disponibilitesCreateWithoutReservationInput, disponibilitesUncheckedCreateWithoutReservationInput>
    where?: disponibilitesWhereInput
  }

  export type disponibilitesUpdateToOneWithWhereWithoutReservationInput = {
    where?: disponibilitesWhereInput
    data: XOR<disponibilitesUpdateWithoutReservationInput, disponibilitesUncheckedUpdateWithoutReservationInput>
  }

  export type disponibilitesUpdateWithoutReservationInput = {
    id_disponibilite?: BigIntFieldUpdateOperationsInput | bigint | number
    date_dispo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    heure_debut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    heure_fin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    jardin?: jardinUpdateOneWithoutDisponibilitesNestedInput
  }

  export type disponibilitesUncheckedUpdateWithoutReservationInput = {
    id_disponibilite?: BigIntFieldUpdateOperationsInput | bigint | number
    id_jardin?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    date_dispo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    heure_debut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    heure_fin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type jardinUpsertWithoutReservationInput = {
    update: XOR<jardinUpdateWithoutReservationInput, jardinUncheckedUpdateWithoutReservationInput>
    create: XOR<jardinCreateWithoutReservationInput, jardinUncheckedCreateWithoutReservationInput>
    where?: jardinWhereInput
  }

  export type jardinUpdateToOneWithWhereWithoutReservationInput = {
    where?: jardinWhereInput
    data: XOR<jardinUpdateWithoutReservationInput, jardinUncheckedUpdateWithoutReservationInput>
  }

  export type jardinUpdateWithoutReservationInput = {
    id_jardin?: BigIntFieldUpdateOperationsInput | bigint | number
    titre?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    superficie?: NullableFloatFieldUpdateOperationsInput | number | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    besoins?: NullableStringFieldUpdateOperationsInput | string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUpdateManyWithoutJardinNestedInput
    disponibilites?: disponibilitesUpdateManyWithoutJardinNestedInput
    utilisateur?: utilisateurUpdateOneRequiredWithoutJardinNestedInput
  }

  export type jardinUncheckedUpdateWithoutReservationInput = {
    id_jardin?: BigIntFieldUpdateOperationsInput | bigint | number
    id_proprietaire?: BigIntFieldUpdateOperationsInput | bigint | number
    titre?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    superficie?: NullableFloatFieldUpdateOperationsInput | number | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    besoins?: NullableStringFieldUpdateOperationsInput | string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUncheckedUpdateManyWithoutJardinNestedInput
    disponibilites?: disponibilitesUncheckedUpdateManyWithoutJardinNestedInput
  }

  export type utilisateurUpsertWithoutReservationInput = {
    update: XOR<utilisateurUpdateWithoutReservationInput, utilisateurUncheckedUpdateWithoutReservationInput>
    create: XOR<utilisateurCreateWithoutReservationInput, utilisateurUncheckedCreateWithoutReservationInput>
    where?: utilisateurWhereInput
  }

  export type utilisateurUpdateToOneWithWhereWithoutReservationInput = {
    where?: utilisateurWhereInput
    data: XOR<utilisateurUpdateWithoutReservationInput, utilisateurUncheckedUpdateWithoutReservationInput>
  }

  export type utilisateurUpdateWithoutReservationInput = {
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
    prenom?: NullableStringFieldUpdateOperationsInput | string | null
    nom?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mot_de_passe?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    photo_profil?: NullableStringFieldUpdateOperationsInput | string | null
    biographie?: NullableStringFieldUpdateOperationsInput | string | null
    date_inscription?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUpdateManyWithoutUtilisateurNestedInput
    heurescumul_es?: heurescumul_esUpdateManyWithoutUtilisateurNestedInput
    jardin?: jardinUpdateOneWithoutUtilisateurNestedInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieUpdateManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurNestedInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieUpdateManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurNestedInput
    competences?: utilisateurCompetenceUpdateManyWithoutUtilisateurNestedInput
  }

  export type utilisateurUncheckedUpdateWithoutReservationInput = {
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
    prenom?: NullableStringFieldUpdateOperationsInput | string | null
    nom?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mot_de_passe?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    photo_profil?: NullableStringFieldUpdateOperationsInput | string | null
    biographie?: NullableStringFieldUpdateOperationsInput | string | null
    date_inscription?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUncheckedUpdateManyWithoutUtilisateurNestedInput
    heurescumul_es?: heurescumul_esUncheckedUpdateManyWithoutUtilisateurNestedInput
    jardin?: jardinUncheckedUpdateOneWithoutUtilisateurNestedInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieUncheckedUpdateManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurNestedInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieUncheckedUpdateManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurNestedInput
    competences?: utilisateurCompetenceUncheckedUpdateManyWithoutUtilisateurNestedInput
  }

  export type avisCreateWithoutUtilisateurInput = {
    id_avis?: bigint | number
    note?: number | null
    commentaire?: string | null
    date_avis?: Date | string | null
    jardin?: jardinCreateNestedOneWithoutAvisInput
  }

  export type avisUncheckedCreateWithoutUtilisateurInput = {
    id_avis?: bigint | number
    id_jardin?: bigint | number | null
    note?: number | null
    commentaire?: string | null
    date_avis?: Date | string | null
  }

  export type avisCreateOrConnectWithoutUtilisateurInput = {
    where: avisWhereUniqueInput
    create: XOR<avisCreateWithoutUtilisateurInput, avisUncheckedCreateWithoutUtilisateurInput>
  }

  export type avisCreateManyUtilisateurInputEnvelope = {
    data: avisCreateManyUtilisateurInput | avisCreateManyUtilisateurInput[]
    skipDuplicates?: boolean
  }

  export type heurescumul_esCreateWithoutUtilisateurInput = {
    id_historique?: bigint | number
    heures_travaillees?: number | null
    date_maj?: Date | string | null
  }

  export type heurescumul_esUncheckedCreateWithoutUtilisateurInput = {
    id_historique?: bigint | number
    heures_travaillees?: number | null
    date_maj?: Date | string | null
  }

  export type heurescumul_esCreateOrConnectWithoutUtilisateurInput = {
    where: heurescumul_esWhereUniqueInput
    create: XOR<heurescumul_esCreateWithoutUtilisateurInput, heurescumul_esUncheckedCreateWithoutUtilisateurInput>
  }

  export type heurescumul_esCreateManyUtilisateurInputEnvelope = {
    data: heurescumul_esCreateManyUtilisateurInput | heurescumul_esCreateManyUtilisateurInput[]
    skipDuplicates?: boolean
  }

  export type jardinCreateWithoutUtilisateurInput = {
    id_jardin?: bigint | number
    titre?: string | null
    description?: string | null
    adresse?: string | null
    superficie?: number | null
    type?: string | null
    besoins?: string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: Date | string | null
    statut?: string | null
    note_moyenne?: number | null
    avis?: avisCreateNestedManyWithoutJardinInput
    disponibilites?: disponibilitesCreateNestedManyWithoutJardinInput
    reservation?: reservationCreateNestedManyWithoutJardinInput
  }

  export type jardinUncheckedCreateWithoutUtilisateurInput = {
    id_jardin?: bigint | number
    titre?: string | null
    description?: string | null
    adresse?: string | null
    superficie?: number | null
    type?: string | null
    besoins?: string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: Date | string | null
    statut?: string | null
    note_moyenne?: number | null
    avis?: avisUncheckedCreateNestedManyWithoutJardinInput
    disponibilites?: disponibilitesUncheckedCreateNestedManyWithoutJardinInput
    reservation?: reservationUncheckedCreateNestedManyWithoutJardinInput
  }

  export type jardinCreateOrConnectWithoutUtilisateurInput = {
    where: jardinWhereUniqueInput
    create: XOR<jardinCreateWithoutUtilisateurInput, jardinUncheckedCreateWithoutUtilisateurInput>
  }

  export type messagerieCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput = {
    id_message?: bigint | number
    contenu?: string | null
    date_envoi?: Date | string | null
    lu?: boolean | null
    utilisateur_messagerie_id_envoyeurToutilisateur?: utilisateurCreateNestedOneWithoutMessagerie_messagerie_id_envoyeurToutilisateurInput
  }

  export type messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput = {
    id_message?: bigint | number
    id_envoyeur?: bigint | number | null
    contenu?: string | null
    date_envoi?: Date | string | null
    lu?: boolean | null
  }

  export type messagerieCreateOrConnectWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput = {
    where: messagerieWhereUniqueInput
    create: XOR<messagerieCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput, messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput>
  }

  export type messagerieCreateManyUtilisateur_messagerie_id_destinataireToutilisateurInputEnvelope = {
    data: messagerieCreateManyUtilisateur_messagerie_id_destinataireToutilisateurInput | messagerieCreateManyUtilisateur_messagerie_id_destinataireToutilisateurInput[]
    skipDuplicates?: boolean
  }

  export type messagerieCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput = {
    id_message?: bigint | number
    contenu?: string | null
    date_envoi?: Date | string | null
    lu?: boolean | null
    utilisateur_messagerie_id_destinataireToutilisateur?: utilisateurCreateNestedOneWithoutMessagerie_messagerie_id_destinataireToutilisateurInput
  }

  export type messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput = {
    id_message?: bigint | number
    id_destinataire?: bigint | number | null
    contenu?: string | null
    date_envoi?: Date | string | null
    lu?: boolean | null
  }

  export type messagerieCreateOrConnectWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput = {
    where: messagerieWhereUniqueInput
    create: XOR<messagerieCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput, messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput>
  }

  export type messagerieCreateManyUtilisateur_messagerie_id_envoyeurToutilisateurInputEnvelope = {
    data: messagerieCreateManyUtilisateur_messagerie_id_envoyeurToutilisateurInput | messagerieCreateManyUtilisateur_messagerie_id_envoyeurToutilisateurInput[]
    skipDuplicates?: boolean
  }

  export type reservationCreateWithoutUtilisateurInput = {
    id_reservation?: bigint | number
    statut?: string | null
    date_reservation?: Date | string | null
    commentaires?: string | null
    disponibilites?: disponibilitesCreateNestedOneWithoutReservationInput
    jardin?: jardinCreateNestedOneWithoutReservationInput
  }

  export type reservationUncheckedCreateWithoutUtilisateurInput = {
    id_reservation?: bigint | number
    id_jardin?: bigint | number | null
    id_disponibilite?: bigint | number | null
    statut?: string | null
    date_reservation?: Date | string | null
    commentaires?: string | null
  }

  export type reservationCreateOrConnectWithoutUtilisateurInput = {
    where: reservationWhereUniqueInput
    create: XOR<reservationCreateWithoutUtilisateurInput, reservationUncheckedCreateWithoutUtilisateurInput>
  }

  export type reservationCreateManyUtilisateurInputEnvelope = {
    data: reservationCreateManyUtilisateurInput | reservationCreateManyUtilisateurInput[]
    skipDuplicates?: boolean
  }

  export type utilisateurCompetenceCreateWithoutUtilisateurInput = {
    competence: competenceCreateNestedOneWithoutUtilisateursInput
  }

  export type utilisateurCompetenceUncheckedCreateWithoutUtilisateurInput = {
    id_utilisateur_competence?: number
    id_competence: number
  }

  export type utilisateurCompetenceCreateOrConnectWithoutUtilisateurInput = {
    where: utilisateurCompetenceWhereUniqueInput
    create: XOR<utilisateurCompetenceCreateWithoutUtilisateurInput, utilisateurCompetenceUncheckedCreateWithoutUtilisateurInput>
  }

  export type utilisateurCompetenceCreateManyUtilisateurInputEnvelope = {
    data: utilisateurCompetenceCreateManyUtilisateurInput | utilisateurCompetenceCreateManyUtilisateurInput[]
    skipDuplicates?: boolean
  }

  export type avisUpsertWithWhereUniqueWithoutUtilisateurInput = {
    where: avisWhereUniqueInput
    update: XOR<avisUpdateWithoutUtilisateurInput, avisUncheckedUpdateWithoutUtilisateurInput>
    create: XOR<avisCreateWithoutUtilisateurInput, avisUncheckedCreateWithoutUtilisateurInput>
  }

  export type avisUpdateWithWhereUniqueWithoutUtilisateurInput = {
    where: avisWhereUniqueInput
    data: XOR<avisUpdateWithoutUtilisateurInput, avisUncheckedUpdateWithoutUtilisateurInput>
  }

  export type avisUpdateManyWithWhereWithoutUtilisateurInput = {
    where: avisScalarWhereInput
    data: XOR<avisUpdateManyMutationInput, avisUncheckedUpdateManyWithoutUtilisateurInput>
  }

  export type heurescumul_esUpsertWithWhereUniqueWithoutUtilisateurInput = {
    where: heurescumul_esWhereUniqueInput
    update: XOR<heurescumul_esUpdateWithoutUtilisateurInput, heurescumul_esUncheckedUpdateWithoutUtilisateurInput>
    create: XOR<heurescumul_esCreateWithoutUtilisateurInput, heurescumul_esUncheckedCreateWithoutUtilisateurInput>
  }

  export type heurescumul_esUpdateWithWhereUniqueWithoutUtilisateurInput = {
    where: heurescumul_esWhereUniqueInput
    data: XOR<heurescumul_esUpdateWithoutUtilisateurInput, heurescumul_esUncheckedUpdateWithoutUtilisateurInput>
  }

  export type heurescumul_esUpdateManyWithWhereWithoutUtilisateurInput = {
    where: heurescumul_esScalarWhereInput
    data: XOR<heurescumul_esUpdateManyMutationInput, heurescumul_esUncheckedUpdateManyWithoutUtilisateurInput>
  }

  export type heurescumul_esScalarWhereInput = {
    AND?: heurescumul_esScalarWhereInput | heurescumul_esScalarWhereInput[]
    OR?: heurescumul_esScalarWhereInput[]
    NOT?: heurescumul_esScalarWhereInput | heurescumul_esScalarWhereInput[]
    id_historique?: BigIntFilter<"heurescumul_es"> | bigint | number
    id_utilisateur?: BigIntNullableFilter<"heurescumul_es"> | bigint | number | null
    heures_travaillees?: FloatNullableFilter<"heurescumul_es"> | number | null
    date_maj?: DateTimeNullableFilter<"heurescumul_es"> | Date | string | null
  }

  export type jardinUpsertWithoutUtilisateurInput = {
    update: XOR<jardinUpdateWithoutUtilisateurInput, jardinUncheckedUpdateWithoutUtilisateurInput>
    create: XOR<jardinCreateWithoutUtilisateurInput, jardinUncheckedCreateWithoutUtilisateurInput>
    where?: jardinWhereInput
  }

  export type jardinUpdateToOneWithWhereWithoutUtilisateurInput = {
    where?: jardinWhereInput
    data: XOR<jardinUpdateWithoutUtilisateurInput, jardinUncheckedUpdateWithoutUtilisateurInput>
  }

  export type jardinUpdateWithoutUtilisateurInput = {
    id_jardin?: BigIntFieldUpdateOperationsInput | bigint | number
    titre?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    superficie?: NullableFloatFieldUpdateOperationsInput | number | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    besoins?: NullableStringFieldUpdateOperationsInput | string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUpdateManyWithoutJardinNestedInput
    disponibilites?: disponibilitesUpdateManyWithoutJardinNestedInput
    reservation?: reservationUpdateManyWithoutJardinNestedInput
  }

  export type jardinUncheckedUpdateWithoutUtilisateurInput = {
    id_jardin?: BigIntFieldUpdateOperationsInput | bigint | number
    titre?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    superficie?: NullableFloatFieldUpdateOperationsInput | number | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    besoins?: NullableStringFieldUpdateOperationsInput | string | null
    photos?: NullableJsonNullValueInput | InputJsonValue
    date_publication?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUncheckedUpdateManyWithoutJardinNestedInput
    disponibilites?: disponibilitesUncheckedUpdateManyWithoutJardinNestedInput
    reservation?: reservationUncheckedUpdateManyWithoutJardinNestedInput
  }

  export type messagerieUpsertWithWhereUniqueWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput = {
    where: messagerieWhereUniqueInput
    update: XOR<messagerieUpdateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput, messagerieUncheckedUpdateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput>
    create: XOR<messagerieCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput, messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput>
  }

  export type messagerieUpdateWithWhereUniqueWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput = {
    where: messagerieWhereUniqueInput
    data: XOR<messagerieUpdateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput, messagerieUncheckedUpdateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput>
  }

  export type messagerieUpdateManyWithWhereWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput = {
    where: messagerieScalarWhereInput
    data: XOR<messagerieUpdateManyMutationInput, messagerieUncheckedUpdateManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput>
  }

  export type messagerieScalarWhereInput = {
    AND?: messagerieScalarWhereInput | messagerieScalarWhereInput[]
    OR?: messagerieScalarWhereInput[]
    NOT?: messagerieScalarWhereInput | messagerieScalarWhereInput[]
    id_message?: BigIntFilter<"messagerie"> | bigint | number
    id_envoyeur?: BigIntNullableFilter<"messagerie"> | bigint | number | null
    id_destinataire?: BigIntNullableFilter<"messagerie"> | bigint | number | null
    contenu?: StringNullableFilter<"messagerie"> | string | null
    date_envoi?: DateTimeNullableFilter<"messagerie"> | Date | string | null
    lu?: BoolNullableFilter<"messagerie"> | boolean | null
  }

  export type messagerieUpsertWithWhereUniqueWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput = {
    where: messagerieWhereUniqueInput
    update: XOR<messagerieUpdateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput, messagerieUncheckedUpdateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput>
    create: XOR<messagerieCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput, messagerieUncheckedCreateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput>
  }

  export type messagerieUpdateWithWhereUniqueWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput = {
    where: messagerieWhereUniqueInput
    data: XOR<messagerieUpdateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput, messagerieUncheckedUpdateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput>
  }

  export type messagerieUpdateManyWithWhereWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput = {
    where: messagerieScalarWhereInput
    data: XOR<messagerieUpdateManyMutationInput, messagerieUncheckedUpdateManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput>
  }

  export type reservationUpsertWithWhereUniqueWithoutUtilisateurInput = {
    where: reservationWhereUniqueInput
    update: XOR<reservationUpdateWithoutUtilisateurInput, reservationUncheckedUpdateWithoutUtilisateurInput>
    create: XOR<reservationCreateWithoutUtilisateurInput, reservationUncheckedCreateWithoutUtilisateurInput>
  }

  export type reservationUpdateWithWhereUniqueWithoutUtilisateurInput = {
    where: reservationWhereUniqueInput
    data: XOR<reservationUpdateWithoutUtilisateurInput, reservationUncheckedUpdateWithoutUtilisateurInput>
  }

  export type reservationUpdateManyWithWhereWithoutUtilisateurInput = {
    where: reservationScalarWhereInput
    data: XOR<reservationUpdateManyMutationInput, reservationUncheckedUpdateManyWithoutUtilisateurInput>
  }

  export type utilisateurCompetenceUpsertWithWhereUniqueWithoutUtilisateurInput = {
    where: utilisateurCompetenceWhereUniqueInput
    update: XOR<utilisateurCompetenceUpdateWithoutUtilisateurInput, utilisateurCompetenceUncheckedUpdateWithoutUtilisateurInput>
    create: XOR<utilisateurCompetenceCreateWithoutUtilisateurInput, utilisateurCompetenceUncheckedCreateWithoutUtilisateurInput>
  }

  export type utilisateurCompetenceUpdateWithWhereUniqueWithoutUtilisateurInput = {
    where: utilisateurCompetenceWhereUniqueInput
    data: XOR<utilisateurCompetenceUpdateWithoutUtilisateurInput, utilisateurCompetenceUncheckedUpdateWithoutUtilisateurInput>
  }

  export type utilisateurCompetenceUpdateManyWithWhereWithoutUtilisateurInput = {
    where: utilisateurCompetenceScalarWhereInput
    data: XOR<utilisateurCompetenceUpdateManyMutationInput, utilisateurCompetenceUncheckedUpdateManyWithoutUtilisateurInput>
  }

  export type utilisateurCompetenceScalarWhereInput = {
    AND?: utilisateurCompetenceScalarWhereInput | utilisateurCompetenceScalarWhereInput[]
    OR?: utilisateurCompetenceScalarWhereInput[]
    NOT?: utilisateurCompetenceScalarWhereInput | utilisateurCompetenceScalarWhereInput[]
    id_utilisateur_competence?: IntFilter<"utilisateurCompetence"> | number
    id_utilisateur?: BigIntFilter<"utilisateurCompetence"> | bigint | number
    id_competence?: IntFilter<"utilisateurCompetence"> | number
  }

  export type utilisateurCompetenceCreateWithoutCompetenceInput = {
    utilisateur: utilisateurCreateNestedOneWithoutCompetencesInput
  }

  export type utilisateurCompetenceUncheckedCreateWithoutCompetenceInput = {
    id_utilisateur_competence?: number
    id_utilisateur: bigint | number
  }

  export type utilisateurCompetenceCreateOrConnectWithoutCompetenceInput = {
    where: utilisateurCompetenceWhereUniqueInput
    create: XOR<utilisateurCompetenceCreateWithoutCompetenceInput, utilisateurCompetenceUncheckedCreateWithoutCompetenceInput>
  }

  export type utilisateurCompetenceCreateManyCompetenceInputEnvelope = {
    data: utilisateurCompetenceCreateManyCompetenceInput | utilisateurCompetenceCreateManyCompetenceInput[]
    skipDuplicates?: boolean
  }

  export type utilisateurCompetenceUpsertWithWhereUniqueWithoutCompetenceInput = {
    where: utilisateurCompetenceWhereUniqueInput
    update: XOR<utilisateurCompetenceUpdateWithoutCompetenceInput, utilisateurCompetenceUncheckedUpdateWithoutCompetenceInput>
    create: XOR<utilisateurCompetenceCreateWithoutCompetenceInput, utilisateurCompetenceUncheckedCreateWithoutCompetenceInput>
  }

  export type utilisateurCompetenceUpdateWithWhereUniqueWithoutCompetenceInput = {
    where: utilisateurCompetenceWhereUniqueInput
    data: XOR<utilisateurCompetenceUpdateWithoutCompetenceInput, utilisateurCompetenceUncheckedUpdateWithoutCompetenceInput>
  }

  export type utilisateurCompetenceUpdateManyWithWhereWithoutCompetenceInput = {
    where: utilisateurCompetenceScalarWhereInput
    data: XOR<utilisateurCompetenceUpdateManyMutationInput, utilisateurCompetenceUncheckedUpdateManyWithoutCompetenceInput>
  }

  export type utilisateurCreateWithoutCompetencesInput = {
    id_utilisateur?: bigint | number
    prenom?: string | null
    nom?: string | null
    email?: string | null
    mot_de_passe?: string | null
    role?: string | null
    photo_profil?: string | null
    biographie?: string | null
    date_inscription?: Date | string | null
    telephone?: string | null
    adresse?: string | null
    note_moyenne?: number | null
    avis?: avisCreateNestedManyWithoutUtilisateurInput
    heurescumul_es?: heurescumul_esCreateNestedManyWithoutUtilisateurInput
    jardin?: jardinCreateNestedOneWithoutUtilisateurInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieCreateNestedManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieCreateNestedManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput
    reservation?: reservationCreateNestedManyWithoutUtilisateurInput
  }

  export type utilisateurUncheckedCreateWithoutCompetencesInput = {
    id_utilisateur?: bigint | number
    prenom?: string | null
    nom?: string | null
    email?: string | null
    mot_de_passe?: string | null
    role?: string | null
    photo_profil?: string | null
    biographie?: string | null
    date_inscription?: Date | string | null
    telephone?: string | null
    adresse?: string | null
    note_moyenne?: number | null
    avis?: avisUncheckedCreateNestedManyWithoutUtilisateurInput
    heurescumul_es?: heurescumul_esUncheckedCreateNestedManyWithoutUtilisateurInput
    jardin?: jardinUncheckedCreateNestedOneWithoutUtilisateurInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieUncheckedCreateNestedManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieUncheckedCreateNestedManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput
    reservation?: reservationUncheckedCreateNestedManyWithoutUtilisateurInput
  }

  export type utilisateurCreateOrConnectWithoutCompetencesInput = {
    where: utilisateurWhereUniqueInput
    create: XOR<utilisateurCreateWithoutCompetencesInput, utilisateurUncheckedCreateWithoutCompetencesInput>
  }

  export type competenceCreateWithoutUtilisateursInput = {
    nom: string
  }

  export type competenceUncheckedCreateWithoutUtilisateursInput = {
    id_competence?: number
    nom: string
  }

  export type competenceCreateOrConnectWithoutUtilisateursInput = {
    where: competenceWhereUniqueInput
    create: XOR<competenceCreateWithoutUtilisateursInput, competenceUncheckedCreateWithoutUtilisateursInput>
  }

  export type utilisateurUpsertWithoutCompetencesInput = {
    update: XOR<utilisateurUpdateWithoutCompetencesInput, utilisateurUncheckedUpdateWithoutCompetencesInput>
    create: XOR<utilisateurCreateWithoutCompetencesInput, utilisateurUncheckedCreateWithoutCompetencesInput>
    where?: utilisateurWhereInput
  }

  export type utilisateurUpdateToOneWithWhereWithoutCompetencesInput = {
    where?: utilisateurWhereInput
    data: XOR<utilisateurUpdateWithoutCompetencesInput, utilisateurUncheckedUpdateWithoutCompetencesInput>
  }

  export type utilisateurUpdateWithoutCompetencesInput = {
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
    prenom?: NullableStringFieldUpdateOperationsInput | string | null
    nom?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mot_de_passe?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    photo_profil?: NullableStringFieldUpdateOperationsInput | string | null
    biographie?: NullableStringFieldUpdateOperationsInput | string | null
    date_inscription?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUpdateManyWithoutUtilisateurNestedInput
    heurescumul_es?: heurescumul_esUpdateManyWithoutUtilisateurNestedInput
    jardin?: jardinUpdateOneWithoutUtilisateurNestedInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieUpdateManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurNestedInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieUpdateManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurNestedInput
    reservation?: reservationUpdateManyWithoutUtilisateurNestedInput
  }

  export type utilisateurUncheckedUpdateWithoutCompetencesInput = {
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
    prenom?: NullableStringFieldUpdateOperationsInput | string | null
    nom?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    mot_de_passe?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    photo_profil?: NullableStringFieldUpdateOperationsInput | string | null
    biographie?: NullableStringFieldUpdateOperationsInput | string | null
    date_inscription?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    adresse?: NullableStringFieldUpdateOperationsInput | string | null
    note_moyenne?: NullableFloatFieldUpdateOperationsInput | number | null
    avis?: avisUncheckedUpdateManyWithoutUtilisateurNestedInput
    heurescumul_es?: heurescumul_esUncheckedUpdateManyWithoutUtilisateurNestedInput
    jardin?: jardinUncheckedUpdateOneWithoutUtilisateurNestedInput
    messagerie_messagerie_id_destinataireToutilisateur?: messagerieUncheckedUpdateManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurNestedInput
    messagerie_messagerie_id_envoyeurToutilisateur?: messagerieUncheckedUpdateManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurNestedInput
    reservation?: reservationUncheckedUpdateManyWithoutUtilisateurNestedInput
  }

  export type competenceUpsertWithoutUtilisateursInput = {
    update: XOR<competenceUpdateWithoutUtilisateursInput, competenceUncheckedUpdateWithoutUtilisateursInput>
    create: XOR<competenceCreateWithoutUtilisateursInput, competenceUncheckedCreateWithoutUtilisateursInput>
    where?: competenceWhereInput
  }

  export type competenceUpdateToOneWithWhereWithoutUtilisateursInput = {
    where?: competenceWhereInput
    data: XOR<competenceUpdateWithoutUtilisateursInput, competenceUncheckedUpdateWithoutUtilisateursInput>
  }

  export type competenceUpdateWithoutUtilisateursInput = {
    nom?: StringFieldUpdateOperationsInput | string
  }

  export type competenceUncheckedUpdateWithoutUtilisateursInput = {
    id_competence?: IntFieldUpdateOperationsInput | number
    nom?: StringFieldUpdateOperationsInput | string
  }

  export type reservationCreateManyDisponibilitesInput = {
    id_reservation?: bigint | number
    id_utilisateur?: bigint | number | null
    id_jardin?: bigint | number | null
    statut?: string | null
    date_reservation?: Date | string | null
    commentaires?: string | null
  }

  export type reservationUpdateWithoutDisponibilitesInput = {
    id_reservation?: BigIntFieldUpdateOperationsInput | bigint | number
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    date_reservation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commentaires?: NullableStringFieldUpdateOperationsInput | string | null
    jardin?: jardinUpdateOneWithoutReservationNestedInput
    utilisateur?: utilisateurUpdateOneWithoutReservationNestedInput
  }

  export type reservationUncheckedUpdateWithoutDisponibilitesInput = {
    id_reservation?: BigIntFieldUpdateOperationsInput | bigint | number
    id_utilisateur?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    id_jardin?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    date_reservation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commentaires?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type reservationUncheckedUpdateManyWithoutDisponibilitesInput = {
    id_reservation?: BigIntFieldUpdateOperationsInput | bigint | number
    id_utilisateur?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    id_jardin?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    date_reservation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commentaires?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type avisCreateManyJardinInput = {
    id_avis?: bigint | number
    id_utilisateur?: bigint | number | null
    note?: number | null
    commentaire?: string | null
    date_avis?: Date | string | null
  }

  export type disponibilitesCreateManyJardinInput = {
    id_disponibilite?: bigint | number
    date_dispo?: Date | string | null
    heure_debut?: Date | string | null
    heure_fin?: Date | string | null
    statut?: string | null
  }

  export type reservationCreateManyJardinInput = {
    id_reservation?: bigint | number
    id_utilisateur?: bigint | number | null
    id_disponibilite?: bigint | number | null
    statut?: string | null
    date_reservation?: Date | string | null
    commentaires?: string | null
  }

  export type avisUpdateWithoutJardinInput = {
    id_avis?: BigIntFieldUpdateOperationsInput | bigint | number
    note?: NullableIntFieldUpdateOperationsInput | number | null
    commentaire?: NullableStringFieldUpdateOperationsInput | string | null
    date_avis?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    utilisateur?: utilisateurUpdateOneWithoutAvisNestedInput
  }

  export type avisUncheckedUpdateWithoutJardinInput = {
    id_avis?: BigIntFieldUpdateOperationsInput | bigint | number
    id_utilisateur?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    note?: NullableIntFieldUpdateOperationsInput | number | null
    commentaire?: NullableStringFieldUpdateOperationsInput | string | null
    date_avis?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type avisUncheckedUpdateManyWithoutJardinInput = {
    id_avis?: BigIntFieldUpdateOperationsInput | bigint | number
    id_utilisateur?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    note?: NullableIntFieldUpdateOperationsInput | number | null
    commentaire?: NullableStringFieldUpdateOperationsInput | string | null
    date_avis?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type disponibilitesUpdateWithoutJardinInput = {
    id_disponibilite?: BigIntFieldUpdateOperationsInput | bigint | number
    date_dispo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    heure_debut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    heure_fin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    reservation?: reservationUpdateManyWithoutDisponibilitesNestedInput
  }

  export type disponibilitesUncheckedUpdateWithoutJardinInput = {
    id_disponibilite?: BigIntFieldUpdateOperationsInput | bigint | number
    date_dispo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    heure_debut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    heure_fin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    reservation?: reservationUncheckedUpdateManyWithoutDisponibilitesNestedInput
  }

  export type disponibilitesUncheckedUpdateManyWithoutJardinInput = {
    id_disponibilite?: BigIntFieldUpdateOperationsInput | bigint | number
    date_dispo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    heure_debut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    heure_fin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type reservationUpdateWithoutJardinInput = {
    id_reservation?: BigIntFieldUpdateOperationsInput | bigint | number
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    date_reservation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commentaires?: NullableStringFieldUpdateOperationsInput | string | null
    disponibilites?: disponibilitesUpdateOneWithoutReservationNestedInput
    utilisateur?: utilisateurUpdateOneWithoutReservationNestedInput
  }

  export type reservationUncheckedUpdateWithoutJardinInput = {
    id_reservation?: BigIntFieldUpdateOperationsInput | bigint | number
    id_utilisateur?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    id_disponibilite?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    date_reservation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commentaires?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type reservationUncheckedUpdateManyWithoutJardinInput = {
    id_reservation?: BigIntFieldUpdateOperationsInput | bigint | number
    id_utilisateur?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    id_disponibilite?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    date_reservation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commentaires?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type avisCreateManyUtilisateurInput = {
    id_avis?: bigint | number
    id_jardin?: bigint | number | null
    note?: number | null
    commentaire?: string | null
    date_avis?: Date | string | null
  }

  export type heurescumul_esCreateManyUtilisateurInput = {
    id_historique?: bigint | number
    heures_travaillees?: number | null
    date_maj?: Date | string | null
  }

  export type messagerieCreateManyUtilisateur_messagerie_id_destinataireToutilisateurInput = {
    id_message?: bigint | number
    id_envoyeur?: bigint | number | null
    contenu?: string | null
    date_envoi?: Date | string | null
    lu?: boolean | null
  }

  export type messagerieCreateManyUtilisateur_messagerie_id_envoyeurToutilisateurInput = {
    id_message?: bigint | number
    id_destinataire?: bigint | number | null
    contenu?: string | null
    date_envoi?: Date | string | null
    lu?: boolean | null
  }

  export type reservationCreateManyUtilisateurInput = {
    id_reservation?: bigint | number
    id_jardin?: bigint | number | null
    id_disponibilite?: bigint | number | null
    statut?: string | null
    date_reservation?: Date | string | null
    commentaires?: string | null
  }

  export type utilisateurCompetenceCreateManyUtilisateurInput = {
    id_utilisateur_competence?: number
    id_competence: number
  }

  export type avisUpdateWithoutUtilisateurInput = {
    id_avis?: BigIntFieldUpdateOperationsInput | bigint | number
    note?: NullableIntFieldUpdateOperationsInput | number | null
    commentaire?: NullableStringFieldUpdateOperationsInput | string | null
    date_avis?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    jardin?: jardinUpdateOneWithoutAvisNestedInput
  }

  export type avisUncheckedUpdateWithoutUtilisateurInput = {
    id_avis?: BigIntFieldUpdateOperationsInput | bigint | number
    id_jardin?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    note?: NullableIntFieldUpdateOperationsInput | number | null
    commentaire?: NullableStringFieldUpdateOperationsInput | string | null
    date_avis?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type avisUncheckedUpdateManyWithoutUtilisateurInput = {
    id_avis?: BigIntFieldUpdateOperationsInput | bigint | number
    id_jardin?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    note?: NullableIntFieldUpdateOperationsInput | number | null
    commentaire?: NullableStringFieldUpdateOperationsInput | string | null
    date_avis?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type heurescumul_esUpdateWithoutUtilisateurInput = {
    id_historique?: BigIntFieldUpdateOperationsInput | bigint | number
    heures_travaillees?: NullableFloatFieldUpdateOperationsInput | number | null
    date_maj?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type heurescumul_esUncheckedUpdateWithoutUtilisateurInput = {
    id_historique?: BigIntFieldUpdateOperationsInput | bigint | number
    heures_travaillees?: NullableFloatFieldUpdateOperationsInput | number | null
    date_maj?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type heurescumul_esUncheckedUpdateManyWithoutUtilisateurInput = {
    id_historique?: BigIntFieldUpdateOperationsInput | bigint | number
    heures_travaillees?: NullableFloatFieldUpdateOperationsInput | number | null
    date_maj?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type messagerieUpdateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput = {
    id_message?: BigIntFieldUpdateOperationsInput | bigint | number
    contenu?: NullableStringFieldUpdateOperationsInput | string | null
    date_envoi?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lu?: NullableBoolFieldUpdateOperationsInput | boolean | null
    utilisateur_messagerie_id_envoyeurToutilisateur?: utilisateurUpdateOneWithoutMessagerie_messagerie_id_envoyeurToutilisateurNestedInput
  }

  export type messagerieUncheckedUpdateWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput = {
    id_message?: BigIntFieldUpdateOperationsInput | bigint | number
    id_envoyeur?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    contenu?: NullableStringFieldUpdateOperationsInput | string | null
    date_envoi?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lu?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type messagerieUncheckedUpdateManyWithoutUtilisateur_messagerie_id_destinataireToutilisateurInput = {
    id_message?: BigIntFieldUpdateOperationsInput | bigint | number
    id_envoyeur?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    contenu?: NullableStringFieldUpdateOperationsInput | string | null
    date_envoi?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lu?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type messagerieUpdateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput = {
    id_message?: BigIntFieldUpdateOperationsInput | bigint | number
    contenu?: NullableStringFieldUpdateOperationsInput | string | null
    date_envoi?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lu?: NullableBoolFieldUpdateOperationsInput | boolean | null
    utilisateur_messagerie_id_destinataireToutilisateur?: utilisateurUpdateOneWithoutMessagerie_messagerie_id_destinataireToutilisateurNestedInput
  }

  export type messagerieUncheckedUpdateWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput = {
    id_message?: BigIntFieldUpdateOperationsInput | bigint | number
    id_destinataire?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    contenu?: NullableStringFieldUpdateOperationsInput | string | null
    date_envoi?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lu?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type messagerieUncheckedUpdateManyWithoutUtilisateur_messagerie_id_envoyeurToutilisateurInput = {
    id_message?: BigIntFieldUpdateOperationsInput | bigint | number
    id_destinataire?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    contenu?: NullableStringFieldUpdateOperationsInput | string | null
    date_envoi?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lu?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type reservationUpdateWithoutUtilisateurInput = {
    id_reservation?: BigIntFieldUpdateOperationsInput | bigint | number
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    date_reservation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commentaires?: NullableStringFieldUpdateOperationsInput | string | null
    disponibilites?: disponibilitesUpdateOneWithoutReservationNestedInput
    jardin?: jardinUpdateOneWithoutReservationNestedInput
  }

  export type reservationUncheckedUpdateWithoutUtilisateurInput = {
    id_reservation?: BigIntFieldUpdateOperationsInput | bigint | number
    id_jardin?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    id_disponibilite?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    date_reservation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commentaires?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type reservationUncheckedUpdateManyWithoutUtilisateurInput = {
    id_reservation?: BigIntFieldUpdateOperationsInput | bigint | number
    id_jardin?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    id_disponibilite?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    statut?: NullableStringFieldUpdateOperationsInput | string | null
    date_reservation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    commentaires?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type utilisateurCompetenceUpdateWithoutUtilisateurInput = {
    competence?: competenceUpdateOneRequiredWithoutUtilisateursNestedInput
  }

  export type utilisateurCompetenceUncheckedUpdateWithoutUtilisateurInput = {
    id_utilisateur_competence?: IntFieldUpdateOperationsInput | number
    id_competence?: IntFieldUpdateOperationsInput | number
  }

  export type utilisateurCompetenceUncheckedUpdateManyWithoutUtilisateurInput = {
    id_utilisateur_competence?: IntFieldUpdateOperationsInput | number
    id_competence?: IntFieldUpdateOperationsInput | number
  }

  export type utilisateurCompetenceCreateManyCompetenceInput = {
    id_utilisateur_competence?: number
    id_utilisateur: bigint | number
  }

  export type utilisateurCompetenceUpdateWithoutCompetenceInput = {
    utilisateur?: utilisateurUpdateOneRequiredWithoutCompetencesNestedInput
  }

  export type utilisateurCompetenceUncheckedUpdateWithoutCompetenceInput = {
    id_utilisateur_competence?: IntFieldUpdateOperationsInput | number
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type utilisateurCompetenceUncheckedUpdateManyWithoutCompetenceInput = {
    id_utilisateur_competence?: IntFieldUpdateOperationsInput | number
    id_utilisateur?: BigIntFieldUpdateOperationsInput | bigint | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}