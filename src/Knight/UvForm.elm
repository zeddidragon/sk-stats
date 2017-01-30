module Knight.UvForm exposing (weaponUvForm, armourUvForm)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)
import BaseTypes exposing (..)
import Util exposing (lIndex, atIndex)
import View.Shortcuts exposing (selectListExclude)

weaponUvForm = uvForms
  (List.map toString weaponUvs)
  [Low, Medium, High, VeryHigh]
armourUvForm = uvForms
  ((List.map toString defenceUvs) ++ (List.map toString statusUvs))
  [Low, Medium, High, Maximum]

asName name = {name = name}

defenceUvs =
  [ Normal
  , Piercing
  , Elemental
  , Shadow
  ]

statusUvs =
  [ Fire
  , Freeze
  , Shock
  , Poison
  , Stun
  , Curse
  ]

weaponUvs =
  [ ASI
  , CTR
  , Beast
  , Fiend
  , Gremlin
  , Slime
  , Construct
  , Undead
  ]

uvName equip =
  case equip of
    WeaponUV  (bonus, strength)-> toString bonus
    DefenceUV (dType, strength)-> toString dType
    StatusUV (status, strength)-> toString status
uvStrength equip =
  case equip of
    WeaponUV  (bonus, strength) -> strength
    DefenceUV (dType, strength) -> strength
    StatusUV (status, strength) -> strength

uvForms uvNames uvStrengths message uvs =
  let
    existingNames =
      List.map uvName uvs
    swapType equip index option =
      let
        bonus
          = weaponUvs
          |> List.filter (\bType -> option.name == (toString bType))
          |> List.head
        defence
          = defenceUvs
          |> List.filter (\dType -> option.name == (toString dType))
          |> List.head
        status
          = statusUvs
          |> List.filter (\sType -> option.name == (toString sType))
          |> List.head
        uv =
          case bonus of
            Just thing -> WeaponUV (thing, uvStrength equip)
            Nothing ->
          case defence of
            Just thing -> DefenceUV (thing, uvStrength equip)
            Nothing ->
          case status of
            Just thing -> StatusUV (thing, uvStrength equip)
            Nothing -> StatusUV (None, Low)
      in
        message index uv
    swapStrength equip index value =
      let
        strength =
          String.toInt value
            |> Result.withDefault 0
            |> (flip atIndex) uvStrengths
            |> Maybe.withDefault Low
        uv =
          case equip of
            WeaponUV (bonus, str) -> WeaponUV (bonus, strength)
            DefenceUV (bonus, str) -> DefenceUV (bonus, strength)
            StatusUV (bonus, str) -> StatusUV (bonus, strength)
      in
        message index uv
    uvForm index equip =
      div [ class "item sub" ]
        [ Html.label [] [ "UV" ++ (index + 1 |> toString) |> text ]
        , selectListExclude
          (uvs |> List.map uvName |> List.map asName)
          (swapType equip index)
          (uvNames |> List.map asName)
          (equip |> uvName |> asName)
        , Html.label [] [ equip |> uvStrength |> toString |> text ]
        , input
          [ type_ "range"
          , Html.Attributes.min "0"
          , Html.Attributes.max "3"
          , onInput <| swapStrength equip index
          , equip
            |> uvStrength
            |> (flip lIndex) uvStrengths
            |> Maybe.withDefault 0
            |> toString
            |> value
          ] []
        ]
  in
    List.indexedMap uvForm uvs
