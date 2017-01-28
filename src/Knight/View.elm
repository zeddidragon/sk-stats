module Knight.View exposing (form, stats)

import Html exposing (..)
import Html.Attributes exposing (..)
import BaseTypes exposing (..)
import Knight
import Swords exposing (swords)
import Armour exposing (armours)
import View.Shortcuts exposing (selectList, bar, toText, selectListExclude)
import List
import Tuple exposing (first, second)

replace list index new =
  List.indexedMap (\i old -> if i == index then new else old) list

form message knight =
  let
    helmet = knight.helmet
    armour = knight.armour
    weapon = knight.weapon
    equipHelmet equip = message {knight | helmet = equip}
    equipArmour equip = message {knight | armour = equip}
    equipWeapon equip = message {knight | weapon = equip}
    equipHPiece piece = equipHelmet {helmet | armour = piece}
    equipAPiece piece = equipArmour {armour | armour = piece}
    equipWPiece piece = equipWeapon {weapon | weapon = piece}
    equipHUv index uv = equipHelmet {helmet | uvs = replace helmet.uvs index uv}
    equipAUv index uv = equipArmour {armour | uvs = replace armour.uvs index uv}
    equipWUv index uv = equipWeapon {weapon | uvs = replace weapon.uvs index uv}
  in
    div []
      [ h1 [] [ text knight.name ]
      , div [ class "slot" ]
        ( [ selectList equipHPiece armours knight.helmet.armour |> item "Helmet" ]
          ++ armourUvForms equipHUv knight.helmet.uvs
        )
      , div [ class "slot" ]
        ( [ selectList equipAPiece armours knight.armour.armour |> item "Armour" ]
          ++ armourUvForms equipAUv knight.armour.uvs
        )
      , div [ class "slot" ]
        ( [ selectList equipWPiece  swords knight.weapon.weapon |> item "Weapon" ]
          ++ weaponUvForms equipWUv knight.weapon.uvs
        )
      ]

asName name = {name = name}

armourUvForms message uvs =
  let
    existingNames =
      List.map uvName uvs
    uvNames =
      [ "Normal"
      , "Piercing"
      , "Elemental"
      , "Shadow"
      , "Fire"
      , "Freeze"
      , "Shock"
      , "Poison"
      , "Stun"
      , "Curse"
      ]
    uvName equip =
      case equip of
        DefenceUv (dType, strength)-> toString dType
        StatusUv (status, strength)-> toString status
    uvStrength equip =
      case equip of
        DefenceUv (dType, strength) -> strength
        StatusUv (status, strength) -> strength
    swapType equip index option =
      let
        defence
          = [Normal, Piercing, Elemental, Shadow]
          |> List.filter (\dType -> option.name == (toString dType))
          |> List.head
        status
          = [Fire, Freeze, Shock, Poison, Stun, Curse]
          |> List.filter (\sType -> option.name == (toString sType))
          |> List.head
        uv =
          case defence of
            Just thing -> DefenceUv (thing, uvStrength equip)
            Nothing ->
          case status of
            Just thing -> StatusUv (thing, uvStrength equip)
            Nothing -> StatusUv (Fire, Maximum)
      in
        message index uv
  in
    List.indexedMap (uvForm uvs swapType uvNames uvName) uvs

weaponUvForms message uvs =
  let
    existingNames =
      List.map uvName uvs
    bonuses =
      [ Ctr
      , Asi
      , Beast
      , Fiend
      , Gremlin
      , Slime
      , Construct
      , Undead
      ]
    uvNames = List.map toString bonuses
    uvName equip = equip |> first |> toString
    uvStrength equip = equip |> second
    swapType equip index option =
      let
        bonus
          = bonuses
          |> List.filter (\b -> option.name == (toString b))
          |> List.head
        uv =
          case bonus of
            Just thing -> (thing, uvStrength equip)
            Nothing -> equip
      in
        message index uv
  in
    List.indexedMap (uvForm uvs swapType uvNames uvName) uvs

uvForm uvs swapType uvNames uvName index equip =
  div [ class "item sub" ]
    [ Html.label [] [ text ("UV" ++ (index + 1 |> toString)) ]
    , selectListExclude
      (uvs |> List.map uvName |> List.map asName)
      (swapType equip index)
      (uvNames |> List.map asName)
      (equip |> uvName |> asName)
    ]

stats knight =
  List.concat
    [ [ item "Health" (health knight) ]
    , defences knight
    , resistances knight
    ]
  |> div []

defences knight =
  let
    defence (dtype, amount) =
      item (toString dtype) (div [ class "graphic" ]
        [ bar (toString dtype) amount Knight.maxDefence
        , div [ class "value" ] [ toText amount ]
        ])
  in
    Knight.defences knight |> List.map defence

resistances knight =
  let
    pip = div [ class "pip" ] []
    pips status amount =
      let
        n = truncate amount
      in
        div [ class ("graphic " ++ (toString status)) ]
          [ div [ class "graphic negative" ] ( List.repeat -n pip )
          , div [ class "graphic positive" ] ( List.repeat n pip )
          ]
    resistance (status, amount) =
      item (toString status) (div [ class "graphic" ]
        [ pips status amount
        , div [ class "value" ] [ toText amount ]
        ])
  in
    List.map resistance (Knight.resistances knight)

health knight =
  div [ class "row" ]
    [ div [ class "hearts" ] [ String.repeat (Knight.hearts knight) "♥" |> text ]
    , div [ class "value" ] [ Knight.health knight |> toText ]
    ]


item label content =
  div [ class "item" ]
    [ Html.label [] [ text label ]
    , content
    ]

