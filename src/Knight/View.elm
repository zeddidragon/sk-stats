module Knight.View exposing (form, stats)

import Html exposing (..)
import Html.Attributes exposing (..)
import BaseTypes exposing (..)
import Knight
import Swords exposing (swords)
import Armour exposing (armours)
import View.Shortcuts exposing (selectList, bar, toText)
import List

form message knight =
  let
    helmet = knight.helmet
    armour = knight.armour
    weapon = knight.weapon
    equipHelmet equip = message {knight | helmet = {helmet | armour = equip}}
    equipArmour equip = message {knight | armour = {armour | armour = equip}}
    equipWeapon equip = message {knight | weapon = {weapon | weapon = equip}}
  in
    div []
      [ h1 [] [ text knight.name ]
      , item "Helmet" (selectList equipHelmet armours knight.helmet.armour)
      , item "Armour" (selectList equipArmour armours knight.armour.armour)
      , item "Weapon" (selectList equipWeapon  swords knight.weapon.weapon)
      ]

stats knight =
  div [] (
    [ item "Health" (health knight) ]
    ++ (defences knight)
    ++ (resistances knight)
  )

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

