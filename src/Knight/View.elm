module Knight.View exposing (form, stats)

import Html exposing (div, select, text, h3, span, Html)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Events exposing (..)
import Util exposing (remove, replace)
import Knight.Types exposing (..)
import Knight.UV exposing (..)
import Knight exposing (Knight, WeaponEquip)
import Knight.Bombs
import Knight.Armour exposing (armours)
import Knight.Shield exposing (shields)
import View.Shortcuts exposing (selectList, bar, toText, button)
import Knight.UV.View as UvForm

form message knight =
  let
    equipShield equip = message {knight | shield = equip}
    equipHelmet equip = message {knight | helmet = equip}
    equipArmour equip = message {knight | armour = equip}
    equipWeapons equip = message {knight | weapons = equip}
    equipTrinkets equip = message {knight | trinkets = equip}
  in
    div [ class "knight-form" ]
      (
      [ slot equipShield knight.shield shields "Shield" UvForm.armourForm
      , divisor
      , slot equipHelmet knight.helmet armours "Helmet" UvForm.armourForm
      , slot equipArmour knight.armour armours "Armour" UvForm.armourForm
      , divisor
      ]
      ++ weaponSlots equipWeapons knight
      ++ (divisor :: UvForm.trinketForms equipTrinkets knight.trinkets)
      )

weaponSlots message knight =
  let
    equipWeapon index weapon =
      message <| replace knight.weapons index weapon
    addWeapon =
      message <| knight.weapons ++
        [ { piece = Knight.Bombs.nitro
          , uvs = []
          }
        ]
    removeWeapon index =
      message <| remove index knight.weapons
    weaponSlot index weapon =
      div [class "weapon slot"] (
        slot
          (equipWeapon index)
          weapon
          Knight.weapons
          ("Weapon " ++ toString (index + 1))
          UvForm.weaponForm
        :: (
          if index > 1 then
            [ button [ onClick <| removeWeapon index ] [ text "-" ] ]
          else
            []
        )
      )
  in
    List.indexedMap weaponSlot knight.weapons
    ++ (
      if List.length knight.weapons < 4 then
        [ button [ onClick addWeapon ] [ text "+ Weapon" ] ]
      else
        []
    )

slot message equipment items title uvForm =
  let
    equipPiece piece = message <| {equipment | piece = piece}
    equipUv uvs = message <| {equipment | uvs = uvs}
  in
    div [ class "slot" ]
      ( [ selectList .name equipPiece items equipment.piece |> item title ]
        ++ uvForm equipUv equipment
      )

shield knight =
  let
    piece = knight.shield.piece
  in
    div []
      ( [ h3 [] [ text piece.name ] ]
      ++ (
        if piece == Knight.Shield.recon then
          [ button [] [ text "Apply Deathmark" ] ]
        else
          []
      ) )

stats message side left right events =
  let
    knight = if side == Left then left else right
    opposing = if side == Left then Right else Left
    opponent = if side ==  Left then right else left
    lockdown = message /= Nothing
    health =
      let
        hearts = Knight.hearts knight
        golds =
          if hearts > 60 then hearts - 60
          else 0
        silvers =
          if golds > 0 then 30
          else if hearts > 30 then hearts - 30
          else 0
        reds =
          if silvers > 0 then 30
          else hearts
        heart n =
          let
            fill =
              if remainingHearts < n then "empty"
              else if remainingHearts < 30 + n then "red"
              else if remainingHearts < 60 + n then "silver"
              else "gold"
            border =
              if golds >= n then "gold-border"
              else if silvers >= n then "silver-border"
              else "red-border"
          in
            span [class <| fill ++ " heart " ++ border] []
        damage = Events.totalDamage lockdown opposing left right events
        remaining = Knight.health knight - ceiling damage
        remainingHearts = remaining // 40
      in
        div [ class "row" ] (
          [ div [ class "hearts"] <| List.map heart <| List.range 1 reds
          , div [ class "value" ]
            [ remaining
              |> Basics.max 0
              |> toText
            ]
          ]
        )
  in
    List.concat
      [ [ health |> item "Health"
        , mobility knight |> item "Mobility"
        ]
      , [ divisor ]
      , defences message knight
      , [ divisor ]
      , resistances knight
      , (
        if message == Nothing then
          []
        else
          [ divisor
          , shield knight
          ]
      )
      , List.concat <| List.map (attacks message knight) knight.weapons
      ]
    |> div [ class "knight-stats" ]

defences message knight =
  let
    lockdown = message /= Nothing
    maxDefence = 350
    defence (dtype, amount) =
      item (toString dtype) (div [ class "graphic" ]
        [ bar maxDefence (toString dtype) amount
        , div [ class "value" ] [ toText <| round amount ]
        ])
  in
    Knight.defences lockdown knight |> List.map defence

highlightPips highlights klass amount =
  let
    n = truncate amount
    description tuple =
      case tuple of
        Just (lvl, desc) -> desc
        Nothing -> ""
    pip i =
      let
        isHighlight =
          highlights
            |> List.map Tuple.first
            |> List.member i
        highlight = 
          highlights
            |> List.filter (\(lvl, desc) -> lvl == i)
            |> List.head
            |> description
      in
        div (
        [ class <| "pip" ++ (if isHighlight then " highlight" else "")
        ] ++ (if isHighlight then [ title highlight ] else [])
        ) []
  in
    div [ class ("graphic pips " ++ klass) ]
      [ div [ class "graphic negative" ]
        ( List.range n -1 |> List.map pip )
      , div [ class "hdivisor"] []
      , div [ class "graphic positive" ]
        ( List.range 1 n |> List.map pip)
      ]
pips = highlightPips []

resistances knight =
  let
    sign amount = if amount > 0 then "+" else ""
    immunities status =
      (
        if status == Curse then
          (10, "Immune to Faust's self-curse (but not Gran Faust)")
        else
          (7, "Immune to Minor " ++ (toString status))
      ) :: [ (9, "Immune to Moderate " ++ (toString status)) ]
    resistance (status, amount) =
      item (toString status) (div [ class "graphic" ]
        [ highlightPips (immunities status) (toString status) amount
        , div [ class "value" ] [ sign amount ++ toString amount |> text ]
        ])
  in
    Knight.resistances knight |> List.map resistance
 
attacks message knight weapon =
  let
    piece = weapon.piece
    maxDamage = 715
    bar dType = View.Shortcuts.bar maxDamage (toString dType)
    singlebar damage =
      div [ class "splitbar"]
        [ bar piece.damageType damage ]
    splitbar damage =
      div [ class "splitbar" ]
        [ bar piece.damageType <| damage / 2
        , bar piece.split <| damage / 2
        ]
    actualStatus =
      case piece.status of
        Just status -> status
        Nothing -> Fire
    value label =
      div [ class "value" ] [ text label ]
    status infliction =
      case infliction of
        Just (chance, strength) ->
          [
            div [ class "status-blurb" ]
              [ span [ class "chance" ] [ (toString chance) ++ "%" |> text]
              , span [] [ text "chance of" ]
              , span [ class "strength" ] [ "+" ++ (toString strength) |> text ]
              , span [ class ("status " ++ (toString actualStatus)) ]
                [ toString actualStatus |> text ]
              ]
          ]
        Nothing -> []
    split = piece.split /= Nothing
    attack index ((stage, damage), infliction) =
      [ div [ class "item " ] (
        (
        case message of
          Just msg ->
            Html.label 
              [ onClick <| msg (Attack (piece.name, stage))
              , class "button"
              ]
              [ text <| toString stage ]
          Nothing -> Html.label [] [ text <| toString stage ]
        ) :: (
        if split then
          [ splitbar damage
          , div [class "split-value"]
            [ value <| (toString (ceiling (damage / 2))) ++ " +"
            , value <| toString <| ceiling (damage / 2)
            ]
          , div [ class "combined-value"]
            [ value <| toString <| ceiling damage ]
          ]
        else
          [ singlebar damage
          , value <| toString <| ceiling damage
          ]
        )
      ) ] ++ status infliction
  in
    [ divisor
    , h3 [] [ text piece.name ]
    , attackSpeed knight weapon |> item "Speed"
    , chargeSpeed knight weapon |> item "CT"
    ] ++ (
      Knight.attacks knight weapon
        |> List.indexedMap attack
        |> List.concat
    )


mobility knight =
  let
    maxMobility = 130
    speed = Knight.mobility knight
  in
    div [ class "row graphic" ]
      [ pips "speed" ((toFloat speed - 100) / 4)
      , div [ class "value" ] [ (toString speed) ++ "%" |> text ]
      ]

attackSpeed knight weapon =
  let
    speed = Knight.attackSpeed knight weapon
  in
    div [ class "row graphic" ]
      [ pips "speed" ((toFloat speed - 100) / 4)
      , div [ class "value" ] [ (toString speed) ++ "%" |> text ]
      ]

chargeSpeed knight weapon =
  let
    minTime = 0.55
    maxTime = 8
    speed = Knight.chargeSpeed knight weapon
    pretty num =
      let
        full = num * 10 |> floor |> toString
      in
        String.dropRight 1 full ++ "." ++ String.right 1 full
  in
    div [ class "row graphic" ]
      [ bar (maxTime - minTime) "" (maxTime - speed)
      , div [ class "value" ] [ (pretty speed) ++ "s" |> text ]
      ]

item label content =
  div [ class "item" ]
    [ Html.label [] [ text label ]
    , content
    ]

divisor =
  div [ class "divisor" ] []
